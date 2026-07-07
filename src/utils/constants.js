// LinkedIn's public post composer cuts posts off at 3,000 characters.
// (The "see more" truncation kicks in much earlier, around 210 chars,
// but the hard limit for what you can actually publish is 3,000.)
export const LINKEDIN_LIMIT = 3000;
export const TRUNCATE_PREVIEW = 210; // where LinkedIn folds long posts behind "...see more"

export const ZONES = {
  safe: { max: 0.8, color: '#3B7A57', label: 'Room to write' },
  warn: { max: 1.0, color: '#C97A2B', label: 'Getting close' },
  over: { max: Infinity, color: '#B0402F', label: 'Over the limit' },
};

export function getZone(count, limit = LINKEDIN_LIMIT) {
  const ratio = count / limit;
  if (ratio <= ZONES.safe.max) return { ...ZONES.safe, key: 'safe' };
  if (ratio <= ZONES.warn.max) return { ...ZONES.warn, key: 'warn' };
  return { ...ZONES.over, key: 'over' };
}

export const EMOJI_GROUPS = [
  {
    label: 'Reactions',
    emoji: ['👍', '🎉', '💡', '🔥', '👏', '🙌', '✅', '⭐'],
  },
  {
    label: 'Work',
    emoji: ['🚀', '📈', '🛠️', '💻', '📊', '🧠', '🗓️', '📌'],
  },
  {
    label: 'Faces',
    emoji: ['😀', '😄', '🙂', '😅', '🤔', '😮', '😢', '😎'],
  },
  {
    label: 'Symbols',
    emoji: ['➡️', '🔗', '📍', '🏆', '🎯', '✨', '📝', '💬'],
  },
];
