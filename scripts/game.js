import GameObject from './core/GameObject.js';
import Screen from './core/Screen.js';
import Input from './core/Input.js';
import Camera from './core/graphics/Camera.js';
import Color from './core/graphics/Color.js';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

/**
 * @type {Set<GameObject>}
 */
const gameObjects = new Set();
const camera = new Camera({
	name: 'main',
	clearColor: Color.black,
});
camera.initialize();



gameObjects.forEach(gameObject => gameObject.initialize());

const step = 1 / 60;
let deltaTime = 0;
let lastFrameTime = performance.now();

Screen.initialize(canvas);
Input.initialize();

const loop = () => {
	const timestep = Math.min(0.1, (performance.now() - lastFrameTime) / 1000);
	deltaTime += timestep;

	Input.process();

	while (deltaTime > step) {
		deltaTime -= step;
		gameObjects.forEach(gameObject => !gameObject.isDestroyed && gameObject.fixedUpdate(step));
		// TODO: проверить столкновения
	}

	gameObjects.forEach(gameObject => {
		if (!gameObject.isDestroyed) {
			gameObject.update(timestep);
		}
	});

	camera.update(timestep);
	camera.draw([...gameObjects], context);

	lastFrameTime = performance.now();

	requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
