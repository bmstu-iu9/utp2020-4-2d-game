import Screen from './core/graphics/Screen.js';
import Input from './core/Input.js';
import Scene from './core/Scene.js';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const step = 1 / 60;
let deltaTime = 0;
let lastFrameTime = performance.now();

Screen.initialize(canvas);
Input.initialize();

const closeGame = () => {
	Screen.destroy();
	Input.destroy();
}

const shouldStopLoop = () => {
	if (Scene.current == null) {
		closeGame();
		return true;
	}
	if (!Scene.current.isStarted || !Scene.current.isInitialized) {
		requestAnimationFrame(loop);
		return true;
	}
	return false;
}

const loop = () => {
	if (shouldStopLoop()) {
		lastFrameTime = performance.now();
		return;
	}

	const timestep = Math.min(0.1, (performance.now() - lastFrameTime) / 1000);
	deltaTime += timestep;

	Input.process();

	while (deltaTime > step) {
		deltaTime -= step;
		Scene.current.forEachEnabledGameObject(gameObject => gameObject.fixedUpdate(step));
		if (shouldStopLoop()) {
			lastFrameTime = performance.now();
			return;
		}
		// TODO: проверить столкновения
	}

	Scene.current.forEachEnabledGameObject(gameObject => gameObject.update(timestep));
	if (shouldStopLoop()) {
		lastFrameTime = performance.now();
		return;
	}
	Scene.current.updateCamera(timestep);
	if (shouldStopLoop()) {
		lastFrameTime = performance.now();
		return;
	}
	Scene.current.draw(context);
	if (shouldStopLoop()) {
		lastFrameTime = performance.now();
		return;
	}

	lastFrameTime = performance.now();

	requestAnimationFrame(loop);
};

requestAnimationFrame(loop);
