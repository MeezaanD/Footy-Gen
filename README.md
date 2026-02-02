# Footy-Gen

A tiny, static web app for quickly randomizing football (soccer) sides.

You can add a list of players, choose the match size (currently **10 players / 5v5** or **12 players / 6v6**), then generate two random teams.

## Features

- Add players by name (optional image URL field is present, but the current UI only uses the name)
- Edit / delete players
- Randomize into **Team 1** and **Team 2**
- Persists the player list in **localStorage** (so it survives refreshes)
- Clear all saved players

## Run locally

Because this is a static site, there’s nothing to build.

Option A: open the page directly
- Open `index.html` in your browser

Option B (recommended): run a tiny local server

```bash
# from the repo root
python3 -m http.server 8000
```

Then open:
- http://localhost:8000/

## Deployment (GitHub Pages)

This repo includes a GitHub Actions workflow that deploys the static content to **GitHub Pages** on every push to the `main` branch.

Workflow:
- `.github/workflows/static.yml`

To enable Pages:
1. In GitHub: **Settings → Pages**
2. Set **Build and deployment** to **GitHub Actions**

## Project structure

- `index.html` — app UI + JavaScript logic
- `style.css` — currently empty (styles are inlined in `index.html`)

## Notes

- Player data is stored under the localStorage key: `football_players`.
- The team randomization uses a Fisher–Yates shuffle.
