# ASCII Visual Upgrade Path

The gameplay layer stays in world nodes (`CharacterBody2D`, `StaticBody2D`, `Area2D`).
`AsciiRenderer` is display-only and reads world state without owning collision or interaction logic.

## Token Mapping

Centralized in `res://ui/ascii_palette.gd`:

- `#` -> `tile_wall_or_floor`
- `+` -> `door_closed`
- `/` -> `door_open`
- `C` -> `console_on`
- `c` -> `console_off`
- `@` -> `player_idle`

When upgrading to sprites/animations, replace token rendering with sprite lookup by
`AsciiPalette.TOKEN_TO_ASSET_KEY` so no gameplay scripts need rewrites.
