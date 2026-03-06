extends Node2D
class_name DoorInteractable

@export var closed_prompt: String = "Press E to open"
@export var open_prompt: String = "Press E to close"
@export var starts_open: bool = false
@export var collision_body_path: NodePath = NodePath("CollisionBody")

var _is_open: bool = false
var _collision_body: StaticBody2D
var _interaction_zone: Area2D

func _ready() -> void:
	_collision_body = get_node_or_null(collision_body_path) as StaticBody2D
	_interaction_zone = get_node_or_null("InteractionZone") as Area2D
	if _interaction_zone != null:
		_interaction_zone.add_to_group("player_interactable_zone")
	add_to_group("ascii_door")
	_set_open_state(starts_open)

func interact() -> void:
	_set_open_state(not _is_open)

func get_prompt_text() -> String:
	return open_prompt if _is_open else closed_prompt

func get_ascii_token() -> String:
	return AsciiPalette.DOOR_OPEN if _is_open else AsciiPalette.DOOR_CLOSED

func _set_open_state(is_open: bool) -> void:
	_is_open = is_open
	if _collision_body != null:
		_collision_body.process_mode = PROCESS_MODE_DISABLED if _is_open else PROCESS_MODE_INHERIT
		_collision_body.collision_layer = 0 if _is_open else 1
		_collision_body.collision_mask = 0 if _is_open else 1
		for child in _collision_body.get_children():
			if child is CollisionShape2D:
				(child as CollisionShape2D).disabled = _is_open
