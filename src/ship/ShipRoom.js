import { DoorInteractable } from '../interactables/DoorInteractable.js';
import { ConsoleInteractable } from '../interactables/ConsoleInteractable.js';

export class ShipRoom {
  constructor() {
    this.playerSpawn = { x: -360, y: 100 };
    this.walls = [
      { x: 0, y: 180, width: 960, height: 48 },
      { x: -456, y: -90, width: 48, height: 540 },
      { x: 456, y: -90, width: 48, height: 540 },
      { x: 0, y: -360, width: 960, height: 48 }
    ];

    this.interactables = [
      new DoorInteractable({ x: 0, y: 132 }),
      new ConsoleInteractable({ x: 240, y: 132 })
    ];
  }

  collidesWithWalls(circle) {
    return this.walls.some((wall) => circleAabbOverlap(circle, wall));
  }

  collidesWithBlockingInteractable(circle) {
    return this.interactables.some((item) =>
      typeof item.blocksMovement === 'function' && item.blocksMovement() && circleAabbOverlap(circle, item.bounds())
    );
  }

  getNearestInteractable(point, maxDistance = 44) {
    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const item of this.interactables) {
      const dx = point.x - item.x;
      const dy = point.y - item.y;
      const distance = Math.hypot(dx, dy);
      const radius = item.interactionRadius ?? maxDistance;
      if (distance <= radius && distance < bestDistance) {
        bestDistance = distance;
        best = item;
      }
    }

    return best;
  }
}

function circleAabbOverlap(circle, box) {
  const closestX = Math.max(box.x - box.width / 2, Math.min(circle.x, box.x + box.width / 2));
  const closestY = Math.max(box.y - box.height / 2, Math.min(circle.y, box.y + box.height / 2));
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy < circle.radius * circle.radius;
}
