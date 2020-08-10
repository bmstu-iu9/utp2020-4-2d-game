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
	
	onInitialize() {
		/**
		 * @type {RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(RigidBody);
		if (this.rigidBody == null) {
			throw new Error('no rigid body.');
		}
	}

	onUpdate(delta) {
		if (this.rigidBody.velocity.x > 0 || this.rigidBody.velocity.x < 0) {
			this.transform.setRotation(
				this.transform.rotation + (this.rigidBody.velocity.x / Math.PI) * this.speed * delta,
			);
		}
		if (this.transform.position.y < -5) {
			this.gameObject.destroy();
		}
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
		if (!this.controller.isFreeze) {
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
		if (collider.gameObject.name === 'spike') {
			this.lifeCount--;
			console.log('lives left: ' + this.lifeCount);
			if (this.lifeCount <= 0) {
				console.log('lose');
				this.gameObject.scene.reload();
			} else {
				this.controller.freeze();
				this.rigidBody.setVelocity(new Vector2d(0, 0));
				if (this.transform.position.x <= collider.transform.position.x) {
					this.rigidBody.addForce(new Vector2d(-75, 800));
				} else {
					this.rigidBody.addForce(new Vector2d(75, 800));
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
		this.isFreeze = false;
	}

	freeze() {
		if (!this.canJump) {
			this.isFreeze = true;
		}
	}

	onCollisionEnter(collider) {
		if (collider.gameObject.name === 'platform' || collider.gameObject.name === 'roof') {
			this.canJump = true;
			this.isFreeze = false;
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
		if (!this.isFreeze) {
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
				} else if (Input.getKeyPressed('KeyD')) {
					this.rigidBody.setVelocity(new Vector2d(3, this.rigidBody.velocity.y));
				} else {
					this.rigidBody.setVelocity(new Vector2d(0, this.rigidBody.velocity.y));
				}
			} else {
				if (Input.getKeyPressed('KeyA')) {
					this.rigidBody.setVelocity(new Vector2d(-5, this.rigidBody.velocity.y));
				} else if (Input.getKeyPressed('KeyD')) {
					this.rigidBody.setVelocity(new Vector2d(5, this.rigidBody.velocity.y));
				} else {
					this.rigidBody.setVelocity(new Vector2d(0, this.rigidBody.velocity.y));
				}
				if (Input.getKeyDown('Space') && this.canJump) {
					this.rigidBody.addForce(new Vector2d(0, 750));
					this.canJump = false;
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
		position = new Vector2d(position.x, position.y + 1.2);
		if (position.y < this.floor) {
			position = new Vector2d(position.x, this.floor);
		}
		if (position.x < 0.4) {
			position = new Vector2d(0.4, position.y);
		}
		this.transform.setPosition(position);
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
				this.gameObject.scene.createBallRain();
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
		this.resources.addImageInLoadQueue('hero', 'resources/hero.png');
		this.resources.addImageInLoadQueue('platform', 'resources/platform.png');
		this.resources.addImageInLoadQueue('enemy', 'resources/platform.png');
		this.resources.addImageInLoadQueue('ladder', 'resources/ladder.png');
		this.resources.addImageInLoadQueue('house', 'resources/house.png');
		this.resources.addImageInLoadQueue('ball', 'resources/ball.png');
		this.resources.addImageInLoadQueue('coin', 'resources/coin.png');
		this.resources.addImageInLoadQueue('spike', 'resources/spike.png');
		this.resources.addImageInLoadQueue('rail', 'resources/rail.png');
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
				new BoxCollider(1, 1),
			],
		}));
	}

	createHouse() {
		this.addObject(new GameObject({
			name: 'ladder',
			scale: new Vector2d(1, 1.65),
			position: new Vector2d(25, 5.5),
			components: [
				new BoxCollider(0.2, 2.48),
			],
			children: [
				new GameObject({
					name: 'ladder-sprite',
					position: new Vector2d(0, -0.3),
					components: [
						new SpriteRenderer(new Sprite(this.resources.getImage('ladder')), -1),
					]
				})
			]
		}));
		this.addObject(new GameObject({
			name: 'ladder',
			scale: new Vector2d(1, 1.65),
			position: new Vector2d(36, 5.5),
			components: [
				new BoxCollider(0.2, 2.48),
			],
			children: [
				new GameObject({
					name: 'ladder-sprite',
					position: new Vector2d(0, -0.3),
					components: [
						new SpriteRenderer(new Sprite(this.resources.getImage('ladder')), -1),
					]
				})
			]
		}));
		this.addObject(new GameObject({
			name: 'roof',
			position: new Vector2d(30, 7),
			isStatic: true,
			components: [
				new BoxCollider(15, 1),
				new RigidBody({
					material: new Material(0.2, 0.4),
				}),
			],
		}));
		this.addObject(new GameObject({
			name: 'roof',
			position: new Vector2d(30, 7.2),
			scale: new Vector2d(15, 1),
			isStatic: true,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('platform')), 2),
			],
		}));
		this.createCoin(new Vector2d(32, 8.5));
		this.addObject(new GameObject({
			name: 'house',
			isStatic: true,
			scale: new Vector2d(15, 15),
			position: new Vector2d(30, 0),
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('house')), -4),
			],
		}));
	}

	createCoin(position) {
		this.addObject(new GameObject({
			name: 'coin',
			isStatic: true,
			position: position,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('coin')), 2),
				new CircleCollider(0.5),
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

	createRailSpike(speed, position, size = 1, rotation = 0, isRandom = false) {
		let a = null;
		this.addObject(a = new GameObject({
			name: 'rail',
			position: position,
			rotation: rotation,
			scale: new Vector2d(size, 1),
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('rail')), 2),
			],
		}));
		const min = -0.45;
		const max = 0.45;
		let left = a.transform.transformPoint(new Vector2d(min, 0.06));
		left = new Vector2d(left.x, -left.y);
		let right = a.transform.transformPoint(new Vector2d(max, 0.06));
		right = new Vector2d(right.x, -right.y);
		let spawn = null;
		if (isRandom) {
			let spawn = a.transform.transformPoint(new Vector2d(min + Math.random() * (max - min), 0.06));
			spawn = new Vector2d(spawn.x, -spawn.y);
		} else {
			spawn = a.transform.transformPoint(new Vector2d(0, 0.06));
			spawn = new Vector2d(spawn.x, -spawn.y);
		}
		this.addObject(new GameObject({
			name: 'spike',
			scale: new Vector2d(2, 2),
			rotation: rotation,
			position: spawn,
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('spike')), 2),
				new RigidBody({
					material: new Material(0.5, 0),
					isKinematic: true,
				}),
				new Mover(speed, left, right),
				new BoxCollider(0.31 / 2, 0.48),
			],
		}));
	}

	createBall(position) {
		for (let i = 0; i < 2; i++) {
			this.addObject(new GameObject({
				name: 'ball',
				position: new Vector2d(position.x + (i * 2), position.y),
				components: [
					new SpriteRenderer(new Sprite(this.resources.getImage('ball')), 3),
					new CircleCollider(0.5),
					new RigidBody({
						material: new Material(0.5, 0.5),
					}),
					new Rotater(3),
				],
			}));
		}
		this.addObject(new GameObject({
			name: 'ball',
			position: position.subtract(new Vector2d(2, 0)),
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('ball')), 3),
				new CircleCollider(0.5),
				new RigidBody({
					material: new Material(0.1, 0.5),
				}),
				new Rotater(3),
			],
		}));
	}

	createBallRain() {
		for (let i = -15; i < 15; i++) {
			this.addObject(new GameObject({
				name: 'ball',
				position: new Vector2d(this.hero.transform.position.x + (i * 2), 10),
				components: [
					new SpriteRenderer(new Sprite(this.resources.getImage('ball')), 3),
					new CircleCollider(0.5),
					new RigidBody({
						material: new Material(0.5, 0.5),
						velocity: new Vector2d(-i, Math.random() * i * 2)
					}),
					new Rotater(3),
				],
			}));
		}
	}

	onStart() {
		Screen.setSize(new Vector2d(1280, 720));
		this.hero = new GameObject({
			name: 'hero',
			scale: new Vector2d(1, 1),
			position: new Vector2d(0, -2),
			components: [
				new SpriteRenderer(new Sprite(this.resources.getImage('hero'))),
				new RigidBody({
					material: new Material(0.5, 0),
					gravityScale: 3,
				}),
				new BoxCollider(1, 1),
				new Controller(),
				new Collector(),
				new Player(3, 10),
			],
		});
		this.createPlatform(new Vector2d(-3, 2), new Vector2d(10, 1));
		this.createPlatform(new Vector2d(-7.3, 0), new Vector2d(1, 100));
		this.createRailSpike(5, new Vector2d(-3, -2), 4);
		this.createRailSpike(3, new Vector2d(-6.3, -0.5), 4, Math.PI / 2);
		this.createRailSpike(5, new Vector2d(-3, 1), 4, Math.PI);
		this.addObject(this.hero);
		this.createBall(new Vector2d(-2, 3));
		this.createCoin(new Vector2d(-6, -1.85));
		this.createCoin(new Vector2d(16, 3));
		this.createPlatform(new Vector2d(-3, -3), new Vector2d(10, 1));
		this.createInvisibleWall(new Vector2d(-8.12, 0), new Vector2d(1, 1));
		this.createPlatform(new Vector2d(8, -3), new Vector2d(5, 1));
		this.createPlatform(new Vector2d(20, -2), new Vector2d(15, 4));
		this.createBall(new Vector2d(40, 0));
		this.createPlatform(new Vector2d(39.5, -2), new Vector2d(10, 4));
		this.createPlatform(new Vector2d(48, 2), new Vector2d(3, 1));
		this.createPlatform(new Vector2d(46, -4), new Vector2d(6, 4));
		this.createCoin(new Vector2d(59, 3));
		this.createRailSpike(5, new Vector2d(59, 0.5), 4)
		this.createPlatform(new Vector2d(58, -2), new Vector2d(10, 4));
		this.createPlatform(new Vector2d(65, 2), new Vector2d(3, 1));
		this.createPlatform(new Vector2d(73, -2), new Vector2d(10, 10));
		this.createRailSpike(3, new Vector2d(73, 3.5), 5)
		this.createPlatform(new Vector2d(87, -2), new Vector2d(10, 10));
		this.createCoin(new Vector2d(107, 5));
		this.createPlatform(new Vector2d(106, -2), new Vector2d(20, 10));
		this.createHouse();
		this.addObject(new Camera({
			name: 'camera',
			scale: new Vector2d(0.8, 0.8),
			clearColor: new Color(156, 180, 219),
			components: [
				new Follower(this.hero),
			],
		}));
	}
}
