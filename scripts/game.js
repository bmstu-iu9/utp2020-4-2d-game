import GameObject from './core/GameObject.js';
import Screen from './core/Screen.js';
import Input from './core/Input.js';
import Collider from './core/physics/Collider.js';
import RigidBody from './core/physics/RigidBody.js';
import Collision from './core/physics/Collision.js';

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
Input.initialize();

const loop = () => {
	deltaTime += Math.min(0.4, (performance.now() - lastFrameTime) / 1000);

	Input.process();

	while (deltaTime > step) {
		deltaTime -= step;
		gameObjects.forEach(gameObject => !gameObject.isDestroyed && gameObject.fixedUpdate(step));
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
