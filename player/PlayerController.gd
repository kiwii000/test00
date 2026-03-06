extends CharacterBody2D
class_name PlayerController

@export var move_speed: float = 220.0
@export var interaction_action: StringName = &"interact"
@export var prompt_label_path: NodePath
@export var interaction_detector_path: NodePath = NodePath("InteractionDetector")

var _prompt_label: Label
var _interaction_detector: Area2D
var _active_interactable: Node

func _ready() -> void:
	_prompt_label = get_node_or_null(prompt_label_path) as Label
	_interaction_detector = get_node_or_null(interaction_detector_path) as Area2D
	_set_prompt("")

func _physics_process(_delta: float) -> void:
	var input_vector := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	velocity = input_vector * move_speed
	move_and_slide()
	_update_interaction_target()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed(interaction_action) and _active_interactable != null:
		_active_interactable.call("interact")
		_update_interaction_target()

func _update_interaction_target() -> void:
	if _interaction_detector == null:
		return
	var best_target: Node = null
	var best_distance := INF
	for area in _interaction_detector.get_overlapping_areas():
		if not area.is_in_group("player_interactable_zone"):
			continue
		var parent := area.get_parent()
		if parent == null or not parent.has_method("get_prompt_text"):
			continue
		var distance := global_position.distance_to((parent as Node2D).global_position)
		if distance < best_distance:
			best_distance = distance
			best_target = parent
	_active_interactable = best_target
	if _active_interactable == null:
		_set_prompt("")
	else:
		_set_prompt(_active_interactable.call("get_prompt_text"))

func _set_prompt(prompt: String) -> void:
	if _prompt_label != null:
		_prompt_label.text = prompt
