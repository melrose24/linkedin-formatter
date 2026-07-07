// LinkedIn's composer has no markdown. The bold/italic look people use on
// LinkedIn comes from swapping normal ASCII letters for lookalike characters
// from the Unicode "Mathematical Alphanumeric Symbols" block. This maps
// plain characters to their bold / italic / bold-italic counterparts.

const RANGES = {
  bold: { upperStart: 0x1d400, lowerStart: 0x1d41a, digitStart: 0x1d7ce },
  italic: { upperStart: 0x1d434, lowerStart: 0x1d44e, digitStart: null },
  boldItalic: { upperStart: 0x1d468, lowerStart: 0x1d482, digitStart: null },
};

// A handful of italic letters break the neat arithmetic pattern in the
// Unicode block (h, and the math-italic block skips a few code points
// reserved for existing symbols like ℎ). These are the known exceptions.
const ITALIC_EXCEPTIONS = {
  h: '\u210E', // planck constant, used as italic h
};

function transformChar(ch, mode) {
  const code = ch.charCodeAt(0);
  const range = RANGES[mode];

  if (mode === 'italic' && ITALIC_EXCEPTIONS[ch]) return ITALIC_EXCEPTIONS[ch];

  if (code >= 65 && code <= 90) {
    // A-Z
    return String.fromCodePoint(range.upperStart + (code - 65));
  }
  if (code >= 97 && code <= 122) {
    // a-z
    return String.fromCodePoint(range.lowerStart + (code - 97));
  }
  if (range.digitStart && code >= 48 && code <= 57) {
    // 0-9 (bold only has a digit range; italic digits don't exist in Unicode)
    return String.fromCodePoint(range.digitStart + (code - 48));
  }
  return ch;
}

export function toStyledUnicode(text, mode) {
  return Array.from(text)
    .map((ch) => transformChar(ch, mode))
    .join('');
}

export const BULLET = '•';

export function toBulletList(text) {
  return text
    .split('\n')
    .map((line) => (line.trim().length ? `${BULLET} ${line.trim()}` : line))
    .join('\n');
}
