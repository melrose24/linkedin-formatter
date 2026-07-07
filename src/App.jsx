import { useEffect, useRef, useState } from 'react';
import CharacterGauge from './components/CharacterGauge';
import Toolbar from './components/Toolbar';
import EmojiPicker from './components/EmojiPicker';
import MentionMenu from './components/MentionMenu';
import Preview from './components/Preview';
import { toStyledUnicode, toBulletList } from './utils/textStyle';
import { tryAutoFormat, convertMarkdownBlock } from './utils/textAutoFormat';

const DRAFT_KEY = 'linkedin-formatter:draft';
const CONTACTS_KEY = 'linkedin-formatter:contacts';

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [text, setText] = useState(() => loadJSON(DRAFT_KEY, ''));
  const [contacts, setContacts] = useState(() => loadJSON(CONTACTS_KEY, []));
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(text));
  }, [text]);

  useEffect(() => {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  }, [contacts]);

  function getSelection() {
    const el = textareaRef.current;
    if (!el) return { start: 0, end: 0 };
    return { start: el.selectionStart, end: el.selectionEnd };
  }

  function replaceSelection(nextValue, caretPos) {
    setText(nextValue);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(caretPos, caretPos);
    });
  }

  function applyTransform(mode) {
    const { start, end } = getSelection();
    if (start === end) return; // nothing selected
    const before = text.slice(0, start);
    const selected = text.slice(start, end);
    const after = text.slice(end);
    const styled = toStyledUnicode(selected, mode);
    replaceSelection(before + styled + after, before.length + styled.length);
  }

  function applyBulletList() {
    const { start, end } = getSelection();
    const before = text.slice(0, start);
    const selected = text.slice(start, end) || 'List item';
    const after = text.slice(end);
    const bulleted = toBulletList(selected);
    replaceSelection(before + bulleted + after, before.length + bulleted.length);
  }

  function insertAtCursor(insert) {
    const { start, end } = getSelection();
    const before = text.slice(0, start);
    const after = text.slice(end);
    const nextValue = before + insert + after;
    replaceSelection(nextValue, before.length + insert.length);
  }

  function handleTextChange(e) {
    const rawValue = e.target.value;
    const rawCaret = e.target.selectionStart;

    // If the user just typed the closing marker of **bold** or *italic*,
    // swap it for styled Unicode text and move the caret past it.
    const auto = tryAutoFormat(rawValue, rawCaret);
    const value = auto ? auto.text : rawValue;
    const caret = auto ? auto.caret : rawCaret;

    setText(value);
    if (auto) {
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (el) el.setSelectionRange(caret, caret);
      });
    }

    // Detect an in-progress "@query" right before the caret to drive
    // the mention menu automatically while typing.
    const upToCaret = value.slice(0, caret);
    const match = upToCaret.match(/@([\w.-]*)$/);
    if (match) {
      setMentionQuery(match[1]);
      setMentionOpen(true);
      setEmojiOpen(false);
    } else if (mentionOpen) {
      setMentionOpen(false);
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text/plain');
    if (!pasted) return; // let the browser handle empty/non-text pastes normally
    e.preventDefault();

    const converted = convertMarkdownBlock(pasted);
    const { start, end } = getSelection();
    const before = text.slice(0, start);
    const after = text.slice(end);
    replaceSelection(before + converted + after, before.length + converted.length);
  }

  function handleMentionSelect(name) {
    const el = textareaRef.current;
    const caret = el ? el.selectionStart : text.length;
    const upToCaret = text.slice(0, caret);
    const match = upToCaret.match(/@([\w.-]*)$/);
    if (!match) {
      insertAtCursor(`@${name} `);
    } else {
      const start = match.index;
      const before = text.slice(0, start);
      const after = text.slice(caret);
      const inserted = `@${name} `;
      replaceSelection(before + inserted + after, before.length + inserted.length);
    }
    setMentionOpen(false);
    setMentionQuery('');
  }

  function handleAddContact(name) {
    setContacts((prev) => (prev.includes(name) ? prev : [...prev, name].sort()));
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can fail without permissions; fail silently, button
      // state simply won't flip to "Copied".
    }
  }

  function handleClear() {
    if (text.length === 0) return;
    if (window.confirm('Clear the current draft? This can\u2019t be undone.')) {
      setText('');
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>LinkedIn Post Formatter</h1>
          <p className="app__tagline">
            Draft against LinkedIn&rsquo;s real 3,000-character limit before you paste it in.
          </p>
        </div>
      </header>

      <main className="app__main">
        <section className="pane pane--compose">
          <CharacterGauge count={text.length} />
          <Toolbar
            onBold={() => applyTransform('bold')}
            onItalic={() => applyTransform('italic')}
            onBullet={applyBulletList}
            onEmoji={() => {
              setEmojiOpen((v) => !v);
              setMentionOpen(false);
            }}
            onMention={() => {
              setMentionOpen((v) => !v);
              setEmojiOpen(false);
            }}
            emojiOpen={emojiOpen}
          />

          {emojiOpen && (
            <EmojiPicker
              onPick={(e) => insertAtCursor(e)}
              onClose={() => setEmojiOpen(false)}
            />
          )}
          {mentionOpen && (
            <MentionMenu
              contacts={contacts}
              query={mentionQuery}
              onSelect={handleMentionSelect}
              onAddContact={handleAddContact}
              onClose={() => setMentionOpen(false)}
            />
          )}

          <textarea
            ref={textareaRef}
            className="composer"
            value={text}
            onChange={handleTextChange}
            onPaste={handlePaste}
            placeholder="Start writing your post... type @ to mention a saved contact."
            spellCheck="true"
          />

          <div className="app__actions">
            <button type="button" className="btn btn--ghost" onClick={handleClear}>
              Clear draft
            </button>
            <button type="button" className="btn btn--primary" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy post'}
            </button>
          </div>
        </section>

        <section className="pane pane--preview">
          <h2 className="pane__label">Preview</h2>
          <Preview text={text} />
        </section>
      </main>

      <footer className="app__footer">
        Draft autosaves to this browser only&mdash;nothing is sent anywhere.
      </footer>
    </div>
  );
}
