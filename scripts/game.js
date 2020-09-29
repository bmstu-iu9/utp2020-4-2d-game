import { Game, Resources, Rect } from './core/Core.js';
import Level1 from './scenes/Level1.js';

const playButton = document.getElementById('playButton');
const loader = document.getElementById('loader');

playButton.addEventListener('click', () => {
	playButton.style.display = 'none';
	loader.style.display = 'block';
	const resources = new Resources();
	resources.addTextureInLoadQueue('ball', 'resources/ball.png');
	resources.addTextureInLoadQueue('coin', 'resources/coin.png');
	resources.addTextureInLoadQueue('extraLife', 'resources/extraLife.png');
	resources.addTextureInLoadQueue('spike', 'resources/spike.png');
	resources.addTextureInLoadQueue('laser', 'resources/laser.png');
	resources.addTextureInLoadQueue('trampoline', 'resources/trampoline.png');
	resources.addTextureInLoadQueue('rail', 'resources/rail.png');
	resources.addTextureInLoadQueue('hero', 'resources/hero.png');
	resources.addSoundInLoadQueue('nature', 'resources/nature.mp3');
	resources.addSoundInLoadQueue('theme', 'resources/theme.mp3');
	resources.addTextInLoadQueue('description', 'resources/html_fragments/description.html');
	resources.createTileMapSpriteSheet({
		id: 'tileset',
		path: 'resources/map.png',
		pixelsPerUnit: 16,
		tiles: [
			['door', new Rect(210, 60, 40, 100)],
			['checkPoint', new Rect(250, 87, 20, 95)],
			['turrel', new Rect(69, 112, 59, 28)],
			['3', new Rect(16, 48, 16, 16)],
			['1', new Rect(32, 48, 16, 16)],
			['2', new Rect(48, 48, 16, 16)],
			['01', new Rect(16, 64, 16, 16)],
			['00', new Rect(64, 64, 16, 16)],
			['ladder', new Rect(64, 48, 16, 16)],
			['littlebush', new Rect(0, 32, 32, 16)],
			['bush', new Rect(32, 16, 48, 32)],
			['littletree', new Rect(80, 0, 64, 80)],
			['tree', new Rect(144, 0, 70, 80)],
			['hero', new Rect(0, 80, 16, 32)],
			['walk', new Rect(16, 80, 16, 32)],
			['walk1', new Rect(32, 80, 16, 32)],
			['walk2', new Rect(48, 80, 16, 32)],
			['walk3', new Rect(64, 80, 16, 32)],
			['walk4', new Rect(80, 80, 16, 32)],
			['walk5', new Rect(96, 80, 16, 32)],
			['walk6', new Rect(112, 80, 16, 32)],
			['box1', new Rect(0, 48, 16, 16)],
			['box2', new Rect(0, 64, 16, 16)],
			['finish1', new Rect(128, 80, 76, 28)],
			['finish2', new Rect(128, 108, 76, 28)],
		],
	});

	Game.start({
		scene: Level1,
		canvasId: 'game',
		uiHostId: 'uiHost',
		resources: resources,
		onload: () => {
			loader.style.display = 'none';
		}
	});
});
