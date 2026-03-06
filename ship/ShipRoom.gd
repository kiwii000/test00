extends Node2D
class_name ShipRoom

@export var player_spawn_path: NodePath = NodePath("PlayerSpawn")
@export var ship_camera_path: NodePath = NodePath("ShipCamera")
@export var player_path: NodePath = NodePath("Player")

signal ship_room_ready(spawn_position: Vector2)

func _ready() -> void:
	var player := get_node_or_null(player_path) as Node2D
	if player != null:
		player.global_position = get_player_spawn_position()
	ship_room_ready.emit(get_player_spawn_position())

func get_player_spawn_position() -> Vector2:
	var spawn := get_node_or_null(player_spawn_path) as Marker2D
	if spawn == null:
		return global_position
	return spawn.global_position

func get_ship_camera() -> Camera2D:
	return get_node_or_null(ship_camera_path) as Camera2D
