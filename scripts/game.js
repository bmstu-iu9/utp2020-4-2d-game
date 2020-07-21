import GameObject from './core/GameObject.js';
import Screen from './core/Screen.js';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

/**
 * @type {GameObject[]}
 */
const gameObjects = [];



gameObjects.forEach(gameObject => gameObject.initialize());

const step = 1 / 60;
let deltaTime = 0; 
let lastFrameTime = performance.now();

Screen.initialize(canvas);

const loop = () => {
	deltaTime += Math.min(0.4, (performance.now() - lastFrameTime) / 1000);

	while (deltaTime > step) {
		deltaTime -= step;
		gameObjects.forEach(gameObject => !gameObject.isDestroyed && gameObject.fixedUpdate(step));
		// TODO: проверить столкновения
	}

	gameObjects.forEach(gameObject => {
		if (!gameObject.isDestroyed) {
			gameObject.update(Math.min(0.4, (performance.now() - lastFrameTime) / 1000));
		}
	});

	context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

	gameObjects.forEach(gameObject => !gameObject.isDestroyed && gameObject.draw(context));

	lastFrameTime = performance.now();

	requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
