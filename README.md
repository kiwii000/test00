# Browser ASCII Ship Vertical Slice

This project now runs fully in the browser with a zero-dependency Node dev server.

## Run

```bash
npm install
npm run dev
```

Then open the local URL printed by the dev server (default: http://127.0.0.1:5173).

## Controls

- Move: `WASD` or arrow keys
- Interact: `E`

## Architecture

The original gameplay domains are preserved under `src/`:

- `src/ship/` world layout and collision surfaces
- `src/player/` movement + interaction targeting
- `src/interactables/` stateful door/console entities
- `src/systems/` camera follow behavior
- `src/ui/` ASCII renderer + token palette

`src/ui/ascii_palette.js` centralizes token mapping and future asset keys via `TOKEN_TO_ASSET_KEY`.
