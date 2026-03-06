import { AsciiPalette } from './ascii_palette.js';

export class AsciiRenderer {
  constructor({ canvas, gridCellSize = 24, fontSize = 24, cameraFollowOffset = { x: -420, y: -280 } }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridCellSize = gridCellSize;
    this.fontSize = fontSize;
    this.cameraFollowOffset = cameraFollowOffset;
  }

  render({ shipRoom, player, camera }) {
    const glyphs = new Map();

    for (const wall of shipRoom.walls) {
      this.rasterizeAabb(wall, AsciiPalette.FLOOR_WALL, glyphs);
    }

    for (const item of shipRoom.interactables) {
      const cell = this.worldToGrid(item.x, item.y);
      glyphs.set(`${cell.x},${cell.y}`, item.getAsciiToken());
    }

    const playerCell = this.worldToGrid(player.x, player.y);
    glyphs.set(`${playerCell.x},${playerCell.y}`, AsciiPalette.PLAYER);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#e2e8f0';
    this.ctx.font = `${this.fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    this.ctx.textBaseline = 'top';

    const bounds = getGlyphBounds(glyphs);
    if (!bounds) return;

    const originWorld = this.gridToWorld(bounds.minX, bounds.minY);
    const screenOrigin = this.worldToScreen(originWorld, camera);

    for (let y = bounds.minY; y <= bounds.maxY; y += 1) {
      for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
        const token = glyphs.get(`${x},${y}`) ?? ' ';
        const drawX = screenOrigin.x + (x - bounds.minX) * this.gridCellSize;
        const drawY = screenOrigin.y + (y - bounds.minY) * this.gridCellSize;
        if (token !== ' ') {
          this.ctx.fillText(token, drawX, drawY);
        }
      }
    }
  }

  rasterizeAabb(box, token, glyphs) {
    const min = this.worldToGrid(box.x - box.width / 2, box.y - box.height / 2);
    const max = this.worldToGrid(box.x + box.width / 2, box.y + box.height / 2);
    for (let y = min.y; y <= max.y; y += 1) {
      for (let x = min.x; x <= max.x; x += 1) {
        glyphs.set(`${x},${y}`, token);
      }
    }
  }

  worldToGrid(x, y) {
    return {
      x: Math.floor(x / this.gridCellSize),
      y: Math.floor(y / this.gridCellSize)
    };
  }

  gridToWorld(x, y) {
    return {
      x: x * this.gridCellSize,
      y: y * this.gridCellSize
    };
  }

  worldToScreen(worldPos, camera) {
    return {
      x: (worldPos.x - camera.x) + this.canvas.width / 2 + this.cameraFollowOffset.x,
      y: (worldPos.y - camera.y) + this.canvas.height / 2 + this.cameraFollowOffset.y
    };
  }
}

function getGlyphBounds(glyphs) {
  if (glyphs.size === 0) return null;
  const keys = [...glyphs.keys()].map((key) => key.split(',').map(Number));
  const xs = keys.map(([x]) => x);
  const ys = keys.map(([, y]) => y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys)
  };
}
