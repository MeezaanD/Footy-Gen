# Footy-Gen

Footy-Gen is now an Astro + Tailwind CSS web app with a mobile-first interface and accessible modal flows.

## Stack

- Astro
- React islands for interactive UI
- Tailwind CSS
- Headless UI Dialog for accessible modals

## Features

- Add and remove players with validation
- Choose match size (10, 12, 14, or 22 players)
- Generate randomized home and away teams
- Mobile-first design, enhanced for desktop
- Proper modal flows:
	- Delete confirmation modal
	- Team results modal
	- Settings/help modal
- Persists players and app settings in localStorage

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Build

```bash
npm run build
npm run preview
```

## Deployment (GitHub Pages)

The workflow at `.github/workflows/static.yml` now builds the Astro site and deploys `dist/` to GitHub Pages.

To enable Pages:

1. In GitHub, open Settings then Pages.
2. Set Build and deployment source to GitHub Actions.

## Project structure

- `src/pages/index.astro` - page entry
- `src/layouts/MainLayout.astro` - shared HTML shell
- `src/components/TeamGeneratorApp.tsx` - interactive app island and modals
- `src/styles/global.css` - Tailwind import and global design tokens
