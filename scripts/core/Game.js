import Scene from './Scene.js';
import RigidBody from './physics/RigidBody.js';
import Collider from './physics/Collider.js';
import Collision from './physics/Collision.js';
import Screen from './graphics/Screen.js';
import Input from './Input.js';
import Animator from './animations/Animator.js';

export default class Game {
	/**
	 * @type {HTMLCanvasElement}
	 */
	static canvas;
	/**
	 * @type {CanvasRenderingContext2D}
	 */
	static context;
	/**
	 * @type {HTMLDivElement}
	 */
	static uiHost;

	static step = 1 / 120;
	/**
	 * @type {number}
	 */
	static deltaTime;
	/**
	 * @type {number}
	 */
	static lastFrameTime;

	static start(scene, canvasId, uiHostId) {
		Game.canvas = document.getElementById(canvasId);
		Game.context = Game.canvas.getContext('2d');
		Game.uiHost = document.getElementById(uiHostId);

		Screen.initialize(Game.canvas);
		Input.initialize();

		Game.deltaTime = 0;
		Game.lastFrameTime = performance.now();

		Scene.changeScene(scene);
		requestAnimationFrame(Game.loop);
	}

	static shouldStopLoop() {
		if (Scene.current == null) {
			closeGame();
			return true;
		}
		if (!Scene.current.isStarted || !Scene.current.isInitialized) {
			requestAnimationFrame(Game.loop);
			return true;
		}
		return false;
	}

	static loop() {
		if (Game.shouldStopLoop()) {
			Game.lastFrameTime = performance.now();
			return;
		}
	
		const timestep = Math.min(0.1, (performance.now() - Game.lastFrameTime) / 1000);
		Game.deltaTime += timestep;
	
		const size = Screen.getSize();
		
		if (Game.uiHost.style.width !== `${size.x}px`) {
			Game.uiHost.style.width = `${size.x}px`;
		}
		if (Game.uiHost.style.height !== `${size.y}px`) {
			Game.uiHost.style.height = `${size.y}px`;
		}
	
		Input.process();
		Scene.current.forEachEnabledUIObject(uiObject => uiObject.process());
		if (Game.shouldStopLoop()) {
			Game.lastFrameTime = performance.now();
			return;
		}
	
		while (Game.deltaTime > Game.step) {
			Game.deltaTime -= Game.step;
			Scene.current.forEachEnabledGameObject(gameObject => gameObject.fixedUpdate(Game.step));
			if (Game.shouldStopLoop()) {
				Game.lastFrameTime = performance.now();
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
				RigidBody.dynamicRigidBodies.forEach(dynamicRigidBody => {
					dynamicRigidBody.integrateForces(Game.step / 20);
				});
				collisions.forEach(collision => collision.applyImpulse());
				RigidBody.dynamicRigidBodies.forEach(dynamicRigidBody => {
					dynamicRigidBody.integrateVelocity(Game.step / 20);
				});
			}
			collisions.forEach(collision => collision.positionalCorrection());
			RigidBody.dynamicRigidBodies.forEach(dynamicRigidBody => dynamicRigidBody.clearForce());
			Animator.animators.forEach(animator => animator.process(Game.step));
		}
	
		Scene.current.forEachEnabledGameObject(gameObject => gameObject.update(timestep));
		if (Game.shouldStopLoop()) {
			Game.lastFrameTime = performance.now();
			return;
		}
		Scene.current.updateCamera(timestep);
		if (Game.shouldStopLoop()) {
			Game.lastFrameTime = performance.now();
			return;
		}
		Scene.current.forEachEnabledUIObject(uiObject => uiObject.update(timestep));
		if (Game.shouldStopLoop()) {
			Game.lastFrameTime = performance.now();
			return;
		}
		Scene.current.draw(Game.context);
		if (Game.shouldStopLoop()) {
			Game.lastFrameTime = performance.now();
			return;
		}
	
		Game.lastFrameTime = performance.now();
	
		requestAnimationFrame(Game.loop);
	}

	static closeGame() {
		if (Scene.current != null && !Scene.current.isDestroyed) {
			Scene.current.destroy();
		}
		Screen.destroy();
		Input.destroy();
	}
}
