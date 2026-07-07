export default function Toolbar({ onBold, onItalic, onBullet, onEmoji, onMention, emojiOpen }) {
  return (
    <div className="toolbar" role="toolbar" aria-label="Formatting">
      <button type="button" className="toolbar__btn" onClick={onBold} title="Bold selection">
        <strong>B</strong>
      </button>
      <button type="button" className="toolbar__btn" onClick={onItalic} title="Italicize selection">
        <em>i</em>
      </button>
      <button type="button" className="toolbar__btn" onClick={onBullet} title="Bulleted list">
        ☰
      </button>
      <span className="toolbar__divider" />
      <button
        type="button"
        className={`toolbar__btn ${emojiOpen ? 'toolbar__btn--active' : ''}`}
        onClick={onEmoji}
        title="Insert emoji"
      >
        🙂
      </button>
      <button type="button" className="toolbar__btn" onClick={onMention} title="Insert mention">
        @
      </button>
    </div>
  );
}
