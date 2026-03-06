extends Node2D
class_name ConsoleInteractable

@export var prompt_text: String = "Press E to toggle console"

var _is_on: bool = true

func _ready() -> void:
	var interaction_zone := get_node_or_null("InteractionZone") as Area2D
	if interaction_zone != null:
		interaction_zone.add_to_group("player_interactable_zone")
	add_to_group("ascii_console")

func interact() -> void:
	_is_on = not _is_on

func get_prompt_text() -> String:
	return prompt_text

func get_ascii_token() -> String:
	return AsciiPalette.CONSOLE_ON if _is_on else AsciiPalette.CONSOLE_OFF
