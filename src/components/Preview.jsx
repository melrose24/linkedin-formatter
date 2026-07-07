import { useState } from 'react';
import { TRUNCATE_PREVIEW } from '../utils/constants';

export default function Preview({ text }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > TRUNCATE_PREVIEW;
  const shown = expanded || !needsTruncation ? text : text.slice(0, TRUNCATE_PREVIEW);

  return (
    <div className="preview-card">
      <div className="preview-card__body">
        {shown || <span className="preview-card__placeholder">Your post will appear here as you type.</span>}
        {needsTruncation && !expanded && (
          <button
            type="button"
            className="preview-card__more"
            onClick={() => setExpanded(true)}
          >
            &hellip;see more
          </button>
        )}
      </div>
      {needsTruncation && (
        <p className="preview-card__note">
          LinkedIn folds posts behind &ldquo;see more&rdquo; after roughly{' '}
          {TRUNCATE_PREVIEW} characters. Your first {TRUNCATE_PREVIEW} characters are what
          most people scroll past without tapping through&mdash;lead with your point.
        </p>
      )}
    </div>
  );
}
