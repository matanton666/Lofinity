# Lofinity

A minimalist, open-source lofi music web app for focus and productivity.

## Features

- Multiple lofi music categories and ambient background sounds
- Individual and master volume controls
- Preset soundscapes and custom mixing
- Rotating, aesthetic backgrounds
- Auto-hide, distraction-free UI
- User settings persistence (localStorage)
- No backend, no user accounts

## Getting Started

### 1. Add Your Assets

- Place music files in `assets/music/` (organized by category)
- Place ambient/background sounds in `assets/sounds/`
- Place background images in `assets/backgrounds/`

### 2. Run the App

- Open `index.html` directly in your browser (for development)
- For best results, use a local server (see below)

### 3. Build & Deploy

- This project is ready for static hosting (Netlify, Vercel, GitHub Pages, etc.)
- For production, use a bundler like [Vite](https://vitejs.dev/):

#### Install dependencies (if using Vite)

```
npm install
```

#### Start local dev server

```
npm run dev
```

#### Build for production

```
npm run build
```

#### Preview production build

```
npm run preview
```

### 4. Deploy

- Upload the contents of the `dist/` folder (after build) to your static host

## Project Structure

- `index.html` — Main HTML entry point
- `main.js` — App bootstrapper
- `style.css` — Main styles
- `assets/` — Music, sounds, backgrounds
- `src/` — App source code (see `CODE_STRUCTURE.md` for details)

## Contributing

Pull requests welcome! See the code structure doc for guidance.

## License

MIT
