import Scene from './Scene.js';
import RigidBody from './physics/RigidBody.js';
import Collider from './physics/Collider.js';
import Collision from './physics/Collision.js';
import Screen from './graphics/Screen.js';
import Input from './Input.js';
import Renderer from './graphics/webgl/Renderer.js';
import Resources from './Resources.js'; 
import Animator from './animations/Animator.js';
import Platform from './Platform.js';

export default class Game {
	/**
	 * @type {HTMLCanvasElement}
	 */
	static canvas;
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
	/**
	 * @type {Resources}
	 */
	static resources;
	static isActive = false;

	static start(scene, canvasId, uiHostId, maxQuadCount = 5000) {
		Game.canvas = document.getElementById(canvasId);
		Game.uiHost = document.getElementById(uiHostId);

		Game.resources = new Resources();
		Screen.initialize(Game.canvas);
		Platform.initialize();
		Input.initialize();
		Renderer.initialize(Game.canvas, maxQuadCount);

		Game.resources.addShaderInLoadQueue('texture', 'scripts/core/graphics/webgl/internal_shaders/Texture.glsl');

		Game.resources.loadAll(() => {
			Game.deltaTime = 0;
			Game.lastFrameTime = performance.now();

			Game.isActive = true;
			Scene.changeScene(scene);
			requestAnimationFrame(Game.loop);
		});
	}

	static shouldStopLoop() {
		if (Scene.current == null) {
			this.closeGame();
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
		const start = performance.now();
		Scene.current.draw();
		if (Game.shouldStopLoop()) {
			Game.lastFrameTime = performance.now();
			return;
		}
		Game.drawTime = performance.now() - start;
	
		Game.lastFrameTime = performance.now();
	
		requestAnimationFrame(Game.loop);
	}

	static closeGame() {
		if (!Game.isActive) {
			return;
		}
		Game.isActive = false;
		if (Scene.current != null && !Scene.current.isDestroyed) {
			Scene.current.destroy();
		}
		Game.canvas = null;
		Game.uiHost = null;
		Game.resources.destroy();
		Game.resources = null;
		Screen.destroy();
		Platform.destroy();
		Input.destroy();
		Renderer.destroy();
	}
}
