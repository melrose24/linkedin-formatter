import { toStyledUnicode } from './textStyle';

// Called after every keystroke. Looks at the text up to the caret and, if
// the user just typed the character that *closes* a **bold** or *italic*
// span, swaps the whole span (markers included) for styled Unicode text
// with the markers stripped. Returns null if nothing to convert.
//
// Bold is checked before italic since "**" contains "*" — if we checked
// italic first we'd misfire while the user is still typing the second
// asterisk of a bold pair.
const BOLD_CLOSE = /\*\*([^*\n]+)\*\*$/;
const ITALIC_CLOSE = /(?<!\*)\*([^*\n]+)\*$/;

export function tryAutoFormat(fullText, caret) {
  const head = fullText.slice(0, caret);
  const tail = fullText.slice(caret);

  const boldMatch = head.match(BOLD_CLOSE);
  if (boldMatch) {
    return buildResult(fullText, head, tail, boldMatch, 'bold');
  }

  const italicMatch = head.match(ITALIC_CLOSE);
  if (italicMatch) {
    return buildResult(fullText, head, tail, italicMatch, 'italic');
  }

  return null;
}

function buildResult(fullText, head, tail, match, mode) {
  const raw = match[1];
  const matchStart = head.length - match[0].length;
  const styled = toStyledUnicode(raw, mode);
  const before = head.slice(0, matchStart);
  const nextText = before + styled + tail;
  return { text: nextText, caret: before.length + styled.length };
}

// Used when pasting a block of text (e.g. copied from an AI chat reply)
// that may contain several **bold** and *italic* spans throughout, not
// just one near the cursor. Bold is converted first since "**" contains
// "*" — converting bold first removes those asterisks so the italic pass
// can't accidentally match half of a bold pair.
const BOLD_ALL = /\*\*([^*\n]+)\*\*/g;
const ITALIC_ALL = /\*([^*\n]+)\*/g;

export function convertMarkdownBlock(text) {
  const withBold = text.replace(BOLD_ALL, (_match, inner) => toStyledUnicode(inner, 'bold'));
  return withBold.replace(ITALIC_ALL, (_match, inner) => toStyledUnicode(inner, 'italic'));
}
