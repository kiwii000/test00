import { ShipRoom } from './ship/ShipRoom.js';
import { PlayerController } from './player/PlayerController.js';
import { CameraFollow } from './systems/CameraFollow.js';
import { AsciiRenderer } from './ui/AsciiRenderer.js';

const canvas = document.querySelector('#game');
const promptNode = document.querySelector('#prompt');

const shipRoom = new ShipRoom();
const player = new PlayerController({ x: shipRoom.playerSpawn.x, y: shipRoom.playerSpawn.y });
const camera = new CameraFollow({ offsetX: 0, offsetY: -40 });
const renderer = new AsciiRenderer({
  canvas,
  gridCellSize: 24,
  fontSize: 24,
  cameraFollowOffset: { x: -420, y: -280 }
});

const input = { left: false, right: false, up: false, down: false };

window.addEventListener('keydown', (event) => {
  if (event.key === 'a' || event.key === 'ArrowLeft') input.left = true;
  if (event.key === 'd' || event.key === 'ArrowRight') input.right = true;
  if (event.key === 'w' || event.key === 'ArrowUp') input.up = true;
  if (event.key === 's' || event.key === 'ArrowDown') input.down = true;
  if (event.key.toLowerCase() === 'e') {
    player.interact();
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'a' || event.key === 'ArrowLeft') input.left = false;
  if (event.key === 'd' || event.key === 'ArrowRight') input.right = false;
  if (event.key === 'w' || event.key === 'ArrowUp') input.up = false;
  if (event.key === 's' || event.key === 'ArrowDown') input.down = false;
});

let previous = performance.now();
function tick(now) {
  const deltaSeconds = Math.min((now - previous) / 1000, 0.033);
  previous = now;

  player.update(deltaSeconds, input, shipRoom);
  camera.update(player);
  renderer.render({ shipRoom, player, camera });
  promptNode.textContent = player.getPromptText();

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
