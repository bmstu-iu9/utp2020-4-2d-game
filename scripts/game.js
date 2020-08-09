import Screen from './core/graphics/Screen.js';
import Input from './core/Input.js';
import Scene from './core/Scene.js';
import Collider from './core/physics/Collider.js';
import RigidBody from './core/physics/RigidBody.js';
import Collision from './core/physics/Collision.js';
import Level1 from './scenes/Level1.js';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

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

const step = 1 / 60;
let deltaTime = 0;
let lastFrameTime = performance.now();

Scene.changeScene(Level1);

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
		Collider.dynamicColliders.forEach(collider => collider.recalculate());
		RigidBody.dynamicRigidBodies.forEach(dynamicRigidBody => dynamicRigidBody.recalculate());
		const collisions = [];
		Collider.colliders.forEach(dynamicCollider => {
			Collider.colliders.forEach(collider => {
				if (dynamicCollider !== collider) {
					const collision = Collision.ofColliders(dynamicCollider, collider);
					if (collision != null) {
						collisions.push(collision);
					}
				}
			});
		});
		for (let i = 0; i < 20; i++) {
			RigidBody.dynamicRigidBodies.forEach(dynamicRigidBody => dynamicRigidBody.integrateForces(step / 20));
			collisions.forEach(collision => collision.applyImpulse());
			RigidBody.dynamicRigidBodies.forEach(dynamicRigidBody => dynamicRigidBody.integrateVelocity(step / 20));
		}
		collisions.forEach(collision => collision.positionalCorrection());
		RigidBody.dynamicRigidBodies.forEach(dynamicRigidBody => dynamicRigidBody.clearForce());
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
