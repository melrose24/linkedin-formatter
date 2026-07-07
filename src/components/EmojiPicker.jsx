import { EMOJI_GROUPS } from '../utils/constants';

export default function EmojiPicker({ onPick, onClose }) {
  return (
    <div className="popover" role="dialog" aria-label="Emoji picker">
      <div className="popover__header">
        <span>Emoji</span>
        <button type="button" className="popover__close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <div className="popover__body">
        {EMOJI_GROUPS.map((group) => (
          <div key={group.label} className="emoji-group">
            <div className="emoji-group__label">{group.label}</div>
            <div className="emoji-group__grid">
              {group.emoji.map((e) => (
                <button
                  key={e}
                  type="button"
                  className="emoji-group__item"
                  onClick={() => onPick(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
