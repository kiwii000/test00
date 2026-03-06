extends CanvasLayer
class_name AsciiRenderer

@export var world_root_path: NodePath = NodePath("../")
@export var player_path: NodePath = NodePath("../Player")
@export var ship_camera_path: NodePath = NodePath("../ShipCamera")
@export var ascii_label_path: NodePath = NodePath("AsciiLabel")
@export var grid_cell_size: Vector2 = Vector2(24.0, 24.0)
@export_range(8, 48, 1) var ascii_font_size: int = 24
@export var camera_follow_offset: Vector2 = Vector2.ZERO

var _ascii_label: RichTextLabel
var _world_root: Node2D
var _player: Node2D
var _ship_camera: Camera2D

func _ready() -> void:
	_ascii_label = get_node_or_null(ascii_label_path) as RichTextLabel
	_world_root = get_node_or_null(world_root_path) as Node2D
	_player = get_node_or_null(player_path) as Node2D
	_ship_camera = get_node_or_null(ship_camera_path) as Camera2D
	if _ascii_label == null:
		return
	_ascii_label.fit_content = true
	_ascii_label.bbcode_enabled = false
	_ascii_label.scroll_active = false
	_ascii_label.autowrap_mode = TextServer.AUTOWRAP_OFF
	_ascii_label.add_theme_font_size_override("normal_font_size", ascii_font_size)

func _process(_delta: float) -> void:
	if _ascii_label == null or _world_root == null:
		return
	_draw_ascii_world()

func _draw_ascii_world() -> void:
	var glyphs: Dictionary = {}
	for body in get_tree().get_nodes_in_group("ascii_floor_wall"):
		_rasterize_static_body(body as StaticBody2D, AsciiPalette.FLOOR_WALL, glyphs)

	for door in get_tree().get_nodes_in_group("ascii_door"):
		_add_interactable_glyph(door as Node2D, glyphs)

	for console in get_tree().get_nodes_in_group("ascii_console"):
		_add_interactable_glyph(console as Node2D, glyphs)

	if _player != null:
		glyphs[_world_to_grid(_player.global_position)] = AsciiPalette.PLAYER

	if glyphs.is_empty():
		_ascii_label.text = ""
		return

	var cells: Array = glyphs.keys()
	var min_x := cells[0].x
	var min_y := cells[0].y
	var max_x := min_x
	var max_y := min_y
	for cell in cells:
		min_x = mini(min_x, cell.x)
		min_y = mini(min_y, cell.y)
		max_x = maxi(max_x, cell.x)
		max_y = maxi(max_y, cell.y)

	var lines: PackedStringArray = []
	for y in range(min_y, max_y + 1):
		var line := ""
		for x in range(min_x, max_x + 1):
			var key := Vector2i(x, y)
			line += glyphs.get(key, " ")
		lines.append(line)

	_ascii_label.text = "\n".join(lines)
	_ascii_label.global_position = _world_to_screen(_grid_to_world(Vector2i(min_x, min_y)))

func _rasterize_static_body(body: StaticBody2D, token: String, glyphs: Dictionary) -> void:
	if body == null:
		return
	for child in body.get_children():
		var collision_shape := child as CollisionShape2D
		if collision_shape == null:
			continue
		var rectangle := collision_shape.shape as RectangleShape2D
		if rectangle == null:
			continue
		var half := rectangle.size * 0.5
		var top_left := body.global_position + collision_shape.position - half
		var bottom_right := body.global_position + collision_shape.position + half
		var min_cell := _world_to_grid(top_left)
		var max_cell := _world_to_grid(bottom_right)
		for y in range(min_cell.y, max_cell.y + 1):
			for x in range(min_cell.x, max_cell.x + 1):
				glyphs[Vector2i(x, y)] = token

func _add_interactable_glyph(target: Node2D, glyphs: Dictionary) -> void:
	if target == null:
		return
	if target.has_method("get_ascii_token"):
		glyphs[_world_to_grid(target.global_position)] = target.call("get_ascii_token")

func _world_to_grid(position: Vector2) -> Vector2i:
	return Vector2i(floor(position.x / grid_cell_size.x), floor(position.y / grid_cell_size.y))

func _grid_to_world(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * grid_cell_size.x, cell.y * grid_cell_size.y)

func _world_to_screen(world_position: Vector2) -> Vector2:
	if _ship_camera == null:
		return world_position + camera_follow_offset
	var viewport_rect := get_viewport().get_visible_rect()
	var camera_center := _ship_camera.get_screen_center_position()
	return (world_position - camera_center) + (viewport_rect.size * 0.5) + camera_follow_offset
