# Lofinity Code Structure

This document explains the overall code structure of the Lofinity project and the purpose of each main part.

## Top-Level Structure

- `index.html` — Main HTML entry point, contains the root UI containers.
- `main.js` — App bootstrapper, initializes the application and connects UI to logic.
- `style.css` — Main styles for layout, backgrounds, controls, and responsive design.
- `assets/` — Static assets (music, sounds, backgrounds)
- `src/` — Application source code (modularized by feature)

## Source Code Breakdown (`src/`)

### `core/`

- **Application.js** — Main app controller, manages startup, shutdown, and high-level coordination.
- **AudioCore.js** — Central audio engine, manages Web Audio API context, mixing, and routing.
- **StorageProvider.js** — Handles saving/loading user preferences and session data (localStorage/sessionStorage).

### `audio/`

- **MusicPlayer.js** — Loads, plays, and controls music tracks (categories, play/pause, looping).
- **AmbientSoundManager.js** — Loads, plays, and controls ambient/background sounds (rain, ocean, etc.), including individual volume and mute.

### `ui/`

- **UIManager.js** — Handles UI rendering, updates, and user interaction (sliders, buttons, backgrounds, presets, auto-hide logic).
- **PresetManager.js** — Defines and applies quick soundscape presets.

### `utils/`

- **EventEmitter.js** — Simple event system for decoupled communication between modules.

### `data/`

- (Optional) Static data/configuration for music categories, sound lists, backgrounds, and presets.

## How It All Connects

- `main.js` initializes `Application`, which sets up `AudioCore`, `MusicPlayer`, `AmbientSoundManager`, and `UIManager`.
- UI events (e.g., slider changes, button clicks) are handled by `UIManager` and dispatched to the relevant audio modules.
- Presets and custom mixes are managed by `PresetManager` and applied via the audio modules.
- User preferences are saved/restored using `StorageProvider`.

## Adding New Features

- Add new music/sound/background assets to the `assets/` folders.
- Update the relevant data/config files in `data/` or the UI to expose new options.
- Extend modules or add new ones as needed for advanced features (timers, effects, etc.).

---
This modular structure keeps the codebase clean, maintainable, and easy to extend.
