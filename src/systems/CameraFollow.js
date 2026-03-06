export class CameraFollow {
  constructor({ offsetX = 0, offsetY = -40 } = {}) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.x = 0;
    this.y = 0;
  }

  update(player) {
    this.x = player.x + this.offsetX;
    this.y = player.y + this.offsetY;
  }
}
