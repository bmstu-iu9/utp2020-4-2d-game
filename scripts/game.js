import GameObject from './core/GameObject.js';

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

const loop = () => {
	deltaTime += Math.min(1, (performance.now() - lastFrameTime) / 1000);

	while (deltaTime > step) {
		deltaTime -= step;
		gameObjects.forEach(gameObject => gameObject.onPhysicsUpdate(step));
		// TODO: проверить столкновения
	}

	gameObjects.forEach(gameObject => gameObject.onFrameUpdate(performance.now() - lastFrameTime));

	gameObjects.forEach(gameObject => gameObject.onFrameUpdateEnd(performance.now() - lastFrameTime));

	lastFrameTime = performance.now();

	gameObjects.forEach(gameObject => gameObject.onDraw(context));

	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
