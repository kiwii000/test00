import { AsciiPalette } from '../ui/ascii_palette.js';

export class ConsoleInteractable {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.isOn = true;
    this.interactionRadius = 44;
  }

  interact() {
    this.isOn = !this.isOn;
  }

  getPromptText() {
    return 'Press E to toggle console';
  }

  getAsciiToken() {
    return this.isOn ? AsciiPalette.CONSOLE_ON : AsciiPalette.CONSOLE_OFF;
  }
}
