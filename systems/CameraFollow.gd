extends Node
class_name CameraFollow

@export var player_path: NodePath = NodePath("../Player")
@export var camera_path: NodePath = NodePath("../ShipCamera")
@export var camera_follow_offset: Vector2 = Vector2(0, -40)

var _player: Node2D
var _camera: Camera2D

func _ready() -> void:
	_player = get_node_or_null(player_path) as Node2D
	_camera = get_node_or_null(camera_path) as Camera2D

func _process(_delta: float) -> void:
	if _player == null or _camera == null:
		return
	_camera.global_position = _player.global_position + camera_follow_offset
