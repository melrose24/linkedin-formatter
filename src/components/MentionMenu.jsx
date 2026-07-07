import { useState } from 'react';

export default function MentionMenu({ contacts, query, onSelect, onAddContact, onClose }) {
  const [newName, setNewName] = useState('');
  const filtered = contacts.filter((c) =>
    c.toLowerCase().includes((query || '').toLowerCase())
  );

  return (
    <div className="popover" role="dialog" aria-label="Mention someone">
      <div className="popover__header">
        <span>Mention</span>
        <button type="button" className="popover__close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <div className="popover__body popover__body--mentions">
        {query ? (
          <div className="mention-hint">Filtering by &ldquo;{query}&rdquo;</div>
        ) : null}
        {filtered.length === 0 && (
          <div className="mention-empty">No saved names match. Add one below.</div>
        )}
        <div className="mention-list">
          {filtered.map((name) => (
            <button
              key={name}
              type="button"
              className="mention-list__item"
              onClick={() => onSelect(name)}
            >
              @{name}
            </button>
          ))}
        </div>
        <form
          className="mention-add"
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = newName.trim();
            if (!trimmed) return;
            onAddContact(trimmed);
            setNewName('');
          }}
        >
          <input
            className="mention-add__input"
            placeholder="Add a name to your list"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit" className="mention-add__btn">
            Add
          </button>
        </form>
        <p className="mention-note">
          This inserts plain @Name text. LinkedIn only creates a real, clickable
          tag when you retype the name in LinkedIn&rsquo;s own composer and pick
          them from its suggestions&mdash;this just keeps your draft consistent
          until you do.
        </p>
      </div>
    </div>
  );
}
