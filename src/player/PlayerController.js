export class PlayerController {
  constructor({ x, y, speed = 220 }) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.radius = 10;
    this.activeInteractable = null;
  }

  update(deltaSeconds, input, shipRoom) {
    const moveX = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const moveY = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    const magnitude = Math.hypot(moveX, moveY) || 1;

    const velocityX = (moveX / magnitude) * this.speed;
    const velocityY = (moveY / magnitude) * this.speed;

    const nextX = this.x + velocityX * deltaSeconds;
    const nextY = this.y + velocityY * deltaSeconds;

    const testX = { x: nextX, y: this.y, radius: this.radius };
    if (!shipRoom.collidesWithWalls(testX) && !shipRoom.collidesWithBlockingInteractable(testX)) {
      this.x = nextX;
    }

    const testY = { x: this.x, y: nextY, radius: this.radius };
    if (!shipRoom.collidesWithWalls(testY) && !shipRoom.collidesWithBlockingInteractable(testY)) {
      this.y = nextY;
    }

    this.activeInteractable = shipRoom.getNearestInteractable({ x: this.x, y: this.y });
  }

  interact() {
    if (this.activeInteractable) {
      this.activeInteractable.interact();
    }
  }

  getPromptText() {
    return this.activeInteractable ? this.activeInteractable.getPromptText() : '';
  }
}
