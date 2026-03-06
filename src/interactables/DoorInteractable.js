import { AsciiPalette } from '../ui/ascii_palette.js';

export class DoorInteractable {
  constructor({ x, y, width = 24, height = 96, startsOpen = false }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isOpen = startsOpen;
    this.interactionRadius = 48;
  }

  interact() {
    this.isOpen = !this.isOpen;
  }

  getPromptText() {
    return this.isOpen ? 'Press E to close' : 'Press E to open';
  }

  getAsciiToken() {
    return this.isOpen ? AsciiPalette.DOOR_OPEN : AsciiPalette.DOOR_CLOSED;
  }

  blocksMovement() {
    return !this.isOpen;
  }

  bounds() {
    return {
      left: this.x - this.width / 2,
      right: this.x + this.width / 2,
      top: this.y - this.height / 2,
      bottom: this.y + this.height / 2
    };
  }
}
