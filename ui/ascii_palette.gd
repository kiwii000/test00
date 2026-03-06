extends RefCounted
class_name AsciiPalette

const FLOOR_WALL := "#"
const DOOR_CLOSED := "+"
const DOOR_OPEN := "/"
const CONSOLE_ON := "C"
const CONSOLE_OFF := "c"
const PLAYER := "@"

# Asset-upgrade map: each ASCII token resolves to a future sprite/animation key.
const TOKEN_TO_ASSET_KEY := {
	FLOOR_WALL: "tile_wall_or_floor",
	DOOR_CLOSED: "door_closed",
	DOOR_OPEN: "door_open",
	CONSOLE_ON: "console_on",
	CONSOLE_OFF: "console_off",
	PLAYER: "player_idle",
}
