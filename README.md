# LinkedIn Post Formatter

A small, single-purpose tool for drafting LinkedIn posts against LinkedIn's
real 3,000-character limit, with LinkedIn-flavored bold/italic text, an emoji
picker, and @mention helpers. No backend, no tracking — everything lives in
your browser's local storage.

## Features

- **Character gauge** — a live, dashboard-style meter tracking your draft
  against the 3,000-character limit, with color zones (safe / close /
  over) and tick marks every 500 characters.
- **"See more" preview** — the preview pane mimics LinkedIn's own post card
  and folds long posts behind "...see more" at roughly the same point
  LinkedIn does, so you can see what gets cut off in the feed.
- **Bold / italic** — LinkedIn's composer has no markdown, so this converts
  text to lookalike Unicode characters instead (the same trick real LinkedIn
  "formatters" use). Two ways to do it:
  - Select text and click **B** or _i_.
  - Or just type `**like this**` or `*like this*` — as soon as you type the
    closing marker, it's auto-converted in place and the asterisks are
    removed.
  - Pasting also works: paste a block of text with several `**bold**` or
    `*italic*` spans in it (e.g. copied from an AI chat reply) and every
    matching pair in that paste gets converted at once, not just the one
    nearest your cursor.
- **Bulleted lists** — turns each line of a selection into a `•` bullet.
- **Emoji picker** — a small curated set, grouped by use.
- **@mentions** — type `@` to bring up a filtered list of names you've saved
  locally. This inserts plain `@Name` text to keep your draft consistent;
  it does **not** create a real, clickable LinkedIn tag — you'll still need
  to retype the name in LinkedIn's own composer and pick them from its
  suggestions for that.
- **Autosave** — your draft, saved names, and profile fields persist in
  `localStorage` on your device only. Nothing is sent to a server.

## Local development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
npm run preview   # serve the production build locally
```

## Deploying to GitHub Pages

This repo includes a workflow at `.github/workflows/deploy.yml` that builds
and publishes the app automatically.

1. Push this repo to GitHub.
2. In the repo settings, go to **Pages** and set the source to
   **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the Actions tab).
4. Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

The workflow sets the Vite `base` path to `/<repo-name>/` automatically using
the repository name, so you shouldn't need to edit `vite.config.js` unless
you rename the repo or deploy to a custom domain (in which case, set `base`
to `/`).

## Notes on accuracy

- The 3,000-character hard limit is LinkedIn's documented maximum post
  length. The ~210-character "see more" fold is approximate and based on
  observed behavior — LinkedIn doesn't publish an exact figure, and it can
  vary slightly by device and post content, so treat it as a guide rather
  than a guarantee.
