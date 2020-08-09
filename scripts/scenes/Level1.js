import Scene from '../core/Scene.js';
import GameObject from '../core/GameObject.js';
import SpriteRenderer from '../core/graphics/SpriteRenderer.js';
import Sprite from '../core/graphics/Sprite.js';
import Camera from '../core/graphics/Camera.js';
import Color from '../core/graphics/Color.js';
import Vector2d from '../core/Vector2d.js';
import RigidBody from '../core/physics/RigidBody.js';
import Material from '../core/physics/Material.js';
import BoxCollider from '../core/physics/BoxCollider.js';
import GameComponent from '../core/GameComponent.js';
import Input from '../core/Input.js';
import CameraComponent from '../core/graphics/CameraComponent.js';
import Collider from '../core/physics/Collider.js';
import CircleCollider from '../core/physics/CircleCollider.js';
import Screen from '../core/graphics/Screen.js';

class Rotater extends GameComponent {
	constructor(speed) {
		super();
		this.speed = speed;
	}

	onUpdate(delta) {
		this.transform.setRotation(this.transform.rotation + this.speed * delta);
	}
}

class InteractingObject extends GameComponent {
	interact(gameObject) {

	}
}

class Player extends GameComponent {
	constructor(lifeCount, maxHungryCount) {
		super();
		this.lifeCount = lifeCount;
		this.maxHungryCount = maxHungryCount;
		this.hungryCount = maxHungryCount;
		this.interactingObject = null;
	}

	increaseHunger() {
		this.hungryCount--;
		console.log('hunger: ' + this.hungryCount);
		if (this.hungryCount <= 0) {
			console.log('lose');
			this.gameObject.scene.reload();
		}
	}

	decreaseHunger(levelOfSatiety) {
		this.hungryCount += levelOfSatiety;
		if (this.hungryCount >= this.maxHungryCount) {
			this.hungryCount = this.maxHungryCount;
		}
		console.log('hunger: ' + this.hungryCount);
	}

	onUpdate() {
		if (this.controller.freezeTime <= 0) {
			if (Input.getKeyDown('KeyE') && this.interactingObject != null) {
				this.interactingObject.interact(this.gameObject);
			}
		}
	}

	onInitialize() {
		/**
		 * @type {RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(RigidBody);
		if (this.rigidBody == null) {
			throw new Error('no rigid body.');
		}
		/**
		 * @type {Controller}
		 */
		this.controller = this.gameObject.getComponent(Controller);
		if (this.controller == null) {
			throw new Error('no controller.');
		}
	}

	onCollisionEnter(collider) {
		if (collider.gameObject.name === 'enemy') {
			this.lifeCount--;
			console.log('lives left: ' + this.lifeCount);
			if (this.lifeCount <= 0) {
				console.log('lose');
				this.gameObject.scene.reload();
			} else {
				this.controller.freeze(0.25);
				this.rigidBody.setVelocity(new Vector2d(0, this.rigidBody.velocity.y));
				if (this.transform.position.x <= collider.transform.position.x) {
					this.rigidBody.addForce(new Vector2d(-40, 150));
				} else {
					this.rigidBody.addForce(new Vector2d(40, 150));
				}
			}
		} else {
			if (this.rigidBody.velocity.y < -20) {
				this.lifeCount--;
				console.log('lives left: ' + this.lifeCount);
				if (this.lifeCount <= 0) {
					console.log('lose');
					this.gameObject.scene.reload();
				}
			}
		}
	}

	onTriggerEnter(collider) {
		if (collider.isActive()) { 
			if (collider.gameObject.name === 'candy') {
				this.lifeCount++;
				console.log('lives left: ' + this.lifeCount);
				this.decreaseHunger(2);
				collider.gameObject.destroy();
			} else if (collider.gameObject.name === 'pizza') {
				this.decreaseHunger(10);
				collider.gameObject.destroy();
			} else {
				const interactingObject = collider.gameObject.getComponent(InteractingObject);
				if (interactingObject != null) {
					this.interactingObject = interactingObject; 
				}
			}
		}
	}

	onTriggerExit(collider) {
		if (this.interactingObject != null && collider.gameObject === this.interactingObject.gameObject) {
			this.interactingObject = null;
		}
	}
}

class Controller extends GameComponent {
	onInitialize() {
		/**
		 * @type {RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(RigidBody);
		if (this.rigidBody == null) {
			throw new Error('no rigid body.');
		}
		/**
		 * @type {Player}
		 */
		this.player = this.gameObject.getComponent(Player);
		if (this.player == null) {
			throw new Error('no player.');
		}
		this.freezeTime = 0;
	}

	freeze(time) {
		this.freezeTime = time;
	}

	onCollisionEnter(collider) {
		if (collider.gameObject.name === 'platform' || collider.gameObject.name === 'roof') {
			this.canJump = true;
		}
	}

	onCollisionExit(collider) {
		if (
			collider.gameObject.name === 'platform' 
			&& this.gameObject.getComponent(Collider).collidersInContact.size === 1
		) {
			this.canJump = false;
		}
	}

	onTriggerEnter(collider) {
		if (collider.gameObject.name === 'ladder') {
			this.isLadder = true;
			this.rigidBody.setKinematic(true);
		}
	}

	onTriggerExit(collider) {
		if (collider.gameObject.name === 'ladder') {
			this.isLadder = false;
			this.rigidBody.setKinematic(false);
		}
	}

	onFixedUpdate(delta) {
		if (this.freezeTime > 0) {
			this.freezeTime -= delta;
		}
	}

	onUpdate() {
		if (this.freezeTime <= 0) {
			if (this.isLadder) {
				if (Input.getKeyPressed('KeyW')) {
					this.rigidBody.setVelocity(new Vector2d(this.rigidBody.velocity.x, 3));
				} else if (Input.getKeyPressed('KeyS')) {
					this.rigidBody.setVelocity(new Vector2d(this.rigidBody.velocity.x, -3));
				} else {
					this.rigidBody.setVelocity(new Vector2d(this.rigidBody.velocity.x, 0));
				}
				if (Input.getKeyPressed('KeyA')) {
					this.rigidBody.setVelocity(new Vector2d(-3, this.rigidBody.velocity.y));
					this.transform.setLocalScale(new Vector2d(0.2, this.transform.scale.y));
				} else if (Input.getKeyPressed('KeyD')) {
					this.rigidBody.setVelocity(new Vector2d(3, this.rigidBody.velocity.y));
					this.transform.setLocalScale(new Vector2d(-0.2, this.transform.scale.y));
				} else {
					this.rigidBody.setVelocity(new Vector2d(0, this.rigidBody.velocity.y));
				}
			} else {
				if (Input.getKeyPressed('KeyA')) {
					this.rigidBody.setVelocity(new Vector2d(-5, this.rigidBody.velocity.y));
					this.transform.setLocalScale(new Vector2d(0.2, this.transform.scale.y));
				} else if (Input.getKeyPressed('KeyD')) {
					this.rigidBody.setVelocity(new Vector2d(5, this.rigidBody.velocity.y));
					this.transform.setLocalScale(new Vector2d(-0.2, this.transform.scale.y));
				} else {
					this.rigidBody.setVelocity(new Vector2d(0, this.rigidBody.velocity.y));
				}
				if (Input.getKeyDown('Space') && this.canJump) {
					this.rigidBody.addForce(new Vector2d(0, 200));
					this.canJump = false;
					this.player.increaseHunger();
					if (this.player.hungryCount <= 0) {
						return;
					}
				}
			}
		}
		if (this.transform.position.y < -5) {
			this.gameObject.scene.reload();
		}
	}
}

class Follower extends CameraComponent {
	constructor(target) {
		super();
		this.target = target;
		this.floor = 1.3;
	}
	
	setFloor(y) {
		this.floor = y;
	}

	onUpdate() {
		let position = this.target.transform.position;
		if (position.y < this.floor) {
			position = new Vector2d(position.x, this.floor);
		}
		if (position.x < -0.9) {
			position = new Vector2d(-0.9, position.y);
		}
		this.transform.setPosition(position);
	}
}

class Door extends InteractingObject {
	constructor(destination, floor) {
		super();
		this.destination = destination;
		this.floor = floor;
	}

	onInitialize() {
		const camera = this.gameObject.scene.camera;
		/**
		 * @type {Follower}
		 */
		this.follower = camera.getComponent(Follower);
		if (this.follower == null) {
			throw new Error('no follower.');
		}
	}

	interact(gameObject) {
		gameObject.transform.setPosition(this.destination);
		this.follower.setFloor(this.floor);
	}
}

class Collector extends GameComponent {
	constructor() {
		super();
		this.coinsCount = 0;
	}

	onTriggerEnter(collider) {
		if (collider.gameObject.name === 'coin') {
			this.coinsCount++;
			console.log('coins: ' + this.coinsCount + ' / 5');
			collider.gameObject.destroy();
			if (this.coinsCount >= 5) {
				console.log('win');
				this.gameObject.scene.reload();
			}
		}
	}
}

class Mover extends GameComponent {
	constructor(speed, left, right) {
		super();
		this.speed = speed;
		this.left = left;
		this.right = right;
		this.target = left;
	}

	onInitialize() {
		/**
		 * @type {RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(RigidBody);
		if (this.rigidBody == null) {
			throw new Error('no rigid body.');
		}
	}

	onFixedUpdate(delta) {
		if (this.transform.position.equals(this.target)) {
			if (this.target.equals(this.left)) {
				this.target = this.right;
			} else {
				this.target = this.left;
			}
		}
		this.rigidBody.moveTo(this.target, this.speed, delta);
	}
}

export default class Level1 extends Scene {
	onInitialize() {
		this.resources.addImageInLoadQueue('hero');
		this.resources.addImageInLoadQueue('platform');
		this.resources.addImageInLoadQueue('coin');
		this.resources.addImageInLoadQueue('enemy');
		this.resources.addImageInLoadQueue('ladder');
		this.resources.addImageInLoadQueue('candy');
		this.resources.addImageInLoadQueue('house');
		this.resources.addImageInLoadQueue('pizza');
		this.resources.addImageInLoadQueue('door');
		this.resources.addImageInLoadQueue('background');
	}

	createPlatform(position, scale) {
		this.addObject(new GameObject({
			name: 'platform',
			isStatic: true,
			scale: scale,
			position: position,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('platform')), -3),
				new RigidBody({
					material: new Material(0.5, 0.6),
				}),
				new BoxCollider(5.14, 2.02),
			],
		}));
	}

	createHouse(position, scale) {
		this.createLadder(position.subtract(new Vector2d(6, -0.95)));
		this.addObject(new GameObject({
			name: 'roof',
			scale: new Vector2d(scale.x, 1),
			position: position.add(new Vector2d(0, 3.12)),
			isStatic: true,
			components: [
				new RigidBody({
					material: new Material(0.6, 0),
				}),
				new BoxCollider(8.32, 1),
			],
		}));
		this.addObject(new GameObject({
			name: 'house',
			isStatic: true,
			scale: scale,
			position: position,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('house')), -4),
			],
		}));
	}

	createCoin(position) {
		this.addObject(new GameObject({
			name: 'coin',
			isStatic: true,
			scale: new Vector2d(0.2, 0.2),
			position: position,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('coin')), 2),
				new CircleCollider(3.72 / 2),
			],
		}));
	}

	createInvisibleWall(position, scale) {
		this.addObject(new GameObject({
			name: 'invisibleWall',
			isStatic: true,
			scale: scale,
			position: position,
			components: [
				new BoxCollider(1, 300),
				new RigidBody({
					material: new Material(1, 0),
				}),
			],
		}));
	}

	createLadder(position) {
		this.addObject(new GameObject({
			name: 'ladder',
			scale: new Vector2d(0.5, 1.1),
			position: position,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('ladder')), -1),
				new BoxCollider(2.28 / 3, 4.89),
			],
		}));
	}

	createEnemy(speed, position) {
		this.addObject(new GameObject({
			name: 'enemy',
			scale: new Vector2d(0.4, 0.4),
			position: position,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('enemy')), 2),
				new BoxCollider(2.5, 2.05),
				new RigidBody({
					material: new Material(0.2, 0),
					isKinematic: true,
				}),
				new Mover(speed, position.subtract(new Vector2d(5, 0)), position.add(new Vector2d(5, 0))),
			],
		}));
	}

	createCandy(position) {
		this.addObject(new GameObject({
			name: 'candy',
			isStatic: true,
			scale: new Vector2d(0.2, 0.2),
			position: position,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('candy')), 2),
				new CircleCollider(2.85 / 2),
			],
		}));
	}

	createPizza(position) {
		this.addObject(new GameObject({
			name: 'pizza',
			scale: new Vector2d(0.25, 0.25),
			position: position,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('pizza')), 2),
				new CircleCollider(4.54 / 2),
				new Rotater(3),
			],
		}));
	}

	createDoor(position, destination, floor) {
		this.addObject(new GameObject({
			name: 'door',
			scale: new Vector2d(0.5, 0.5),
			position: position,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('door')), -2),
				new BoxCollider(3.16, 4.88),
				new Door(destination, floor),
			],
		}));
	}

	createBackground(position) {
		this.addObject(new GameObject({
			name: 'background',
			scale: new Vector2d(1.6, 1.6),
			position: position,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('background')), -5),
			],
		}));
	}

	onStart() {
		Screen.setSize(new Vector2d(1080, 720));
		const hero = new GameObject({
			name: 'hero',
			scale: new Vector2d(0.2, 0.2),
			position: new Vector2d(-2, -1),
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('hero'))),
				new RigidBody({
					material: new Material(0.5, 0),
					gravityScale: 3,
				}),
				new BoxCollider(4.12, 3.49),
				new Controller(),
				new Collector(),
				new Player(3, 10),
			],
		});
		this.addObject(hero);
		for (let i = 0; i < 20; i++) {
			this.createBackground(new Vector2d(19.2 * 1.6 * (i + 1) - 24, 2.7));
		}
		this.createPlatform(new Vector2d(0, -3), new Vector2d(3, 0.3));
		this.createInvisibleWall(new Vector2d(-8.12, 0), new Vector2d(1, 1));
		this.createPlatform(new Vector2d(18, -3), new Vector2d(3, 0.3));
		this.createPlatform(new Vector2d(30, -3), new Vector2d(5, 0.3));
		this.createCoin(new Vector2d(18, -2));
		this.createEnemy(3, new Vector2d(26, -2));
		this.createHouse(new Vector2d(42, 0), new Vector2d(2, 2));
		this.createPlatform(new Vector2d(67, -3), new Vector2d(5, 0.3));
		this.createCandy(new Vector2d(67, -2));
		this.createEnemy(3, new Vector2d(75, -2));
		this.createEnemy(3, new Vector2d(85, -2));
		this.createEnemy(3, new Vector2d(95, -2));
		this.createPlatform(new Vector2d(85, -3), new Vector2d(10, 0.3));
		this.createPizza(new Vector2d(105, -2));
		this.createDoor(new Vector2d(115, -1.5), new Vector2d(0, 98.5), 102.3);
		this.createPlatform(new Vector2d(110, -3), new Vector2d(10, 0.3));
		this.createPlatform(new Vector2d(0, 98), new Vector2d(5, 0.3));
		this.createDoor(new Vector2d(0, 99.5), new Vector2d(115, -2.25), 1.3);
		this.createCoin(new Vector2d(10, 99));
		this.createCoin(new Vector2d(125, -2));
		this.createCoin(new Vector2d(80, -2));
		this.createCoin(new Vector2d(42, 6));
		this.addObject(new Camera({
			name: 'camera',
			scale: new Vector2d(0.8, 0.8),
			clearColor: new Color(83, 224, 220),
			components: [
				new Follower(hero),
			],
		}));
	}
}
