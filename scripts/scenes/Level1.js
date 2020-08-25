import * as CORE from '../core/Core.js';

class UICoinsCount extends CORE.UIComponent {
	constructor(hero) {
		super();
		this.hero = hero;
	}

	onInitialize() {
		this.player = this.hero.getComponent(Collector);

	}

	onUpdate() {
		this.uiObject.setInnerHTML(`${this.player.coinsCount}`);
	}
}

class UILifeCount extends CORE.UIComponent {
	constructor(hero) {
		super();
		this.hero = hero;
	}

	onInitialize() {
		this.player = this.hero.getComponent(Player);

	}

	onUpdate() {
		this.uiObject.setInnerHTML(`${this.player.lifeCount}`);
	}
}

class Rotater extends CORE.GameComponent {
	constructor(speed) {
		super();
		this.speed = speed;
	}
	
	onInitialize() {
		/**
		 * @type {CORE.RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(CORE.RigidBody);
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

class InteractingObject extends CORE.GameComponent {
	interact(gameObject) {

	}
}

class Player extends CORE.GameComponent {
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
			if (CORE.Input.getKeyDown('KeyE') && this.interactingObject != null) {
				this.interactingObject.interact(this.gameObject);
			}
		}
	}

	onInitialize() {
		/**
		 * @type {CORE.RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(CORE.RigidBody);
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
				this.rigidBody.setVelocity(new CORE.Vector2d(0, 0));
				if (this.transform.position.x <= collider.transform.position.x) {
					this.rigidBody.addForce(new CORE.Vector2d(-75, 800));
				} else {
					this.rigidBody.addForce(new CORE.Vector2d(75, 800));
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

class Controller extends CORE.GameComponent {
	onInitialize() {
		/**
		 * @type {CORE.RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(CORE.RigidBody);
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
		/**
		 * @type {CORE.Animator}
		 */
		this.animator = this.gameObject.getComponent(CORE.Animator);
		if (this.animator == null) {
			throw new Error('no animator.');
		}
		this.state = 'idle';
	}

	changeState(state) {
		if (this.state === state) {
			return;
		}
		this.animator.play(state);
		this.state = state;
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
			&& this.gameObject.getComponent(CORE.Collider).collidersInContact.size === 1
		) {
			this.canJump = false;
		}
	}

	onTriggerEnter(collider) {
		if (collider.gameObject.name === 'ladders') {
			this.isLadder = true;
			this.rigidBody.setKinematic(true);
		}
	}

	onTriggerExit(collider) {
		if (collider.gameObject.name === 'ladders') {
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
			if (this.isLadder) {
				if (CORE.Input.getKeyPressed('KeyW')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(this.rigidBody.velocity.x, 3));
				} else if (CORE.Input.getKeyPressed('KeyS')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(this.rigidBody.velocity.x, -3));
				} else {
					this.rigidBody.setVelocity(new CORE.Vector2d(this.rigidBody.velocity.x, 0));
				}
				if (CORE.Input.getKeyPressed('KeyA')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(-3, this.rigidBody.velocity.y));
					this.transform.setLocalScale(new CORE.Vector2d(-4, 4));
					this.changeState('walk');
				} else if (CORE.Input.getKeyPressed('KeyD')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(3, this.rigidBody.velocity.y));
					this.transform.setLocalScale(new CORE.Vector2d(4, 4));
					this.changeState('walk');
				} else {
					this.rigidBody.setVelocity(new CORE.Vector2d(0, this.rigidBody.velocity.y));
					this.changeState('idle');
				}
			} else {
				if (CORE.Input.getKeyPressed('KeyA')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(-5, this.rigidBody.velocity.y));
					this.transform.setLocalScale(new CORE.Vector2d(-4, 4));
					this.changeState('walk');
				} else if (CORE.Input.getKeyPressed('KeyD')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(5, this.rigidBody.velocity.y));
					this.transform.setLocalScale(new CORE.Vector2d(4, 4));
					this.changeState('walk');
				} else {
					this.rigidBody.setVelocity(new CORE.Vector2d(0, this.rigidBody.velocity.y));
					this.changeState('idle');
				}
				if (CORE.Input.getKeyDown('Space')) {
					this.rigidBody.addForce(new CORE.Vector2d(0, 550));
				}
			}
		if (this.transform.position.y < -5) {
			this.gameObject.scene.reload();
		}
	}
}

class Follower extends CORE.CameraComponent {
	constructor(target) {
		super();
		this.target = target;
		this.floor = 1.4;
	}
	
	setFloor(y) {
		this.floor = y;
	}

	onUpdate() {
		let position = this.target.transform.position;
		position = new CORE.Vector2d(position.x, position.y + 1.2);
		if (position.y < this.floor) {
			position = new CORE.Vector2d(position.x, this.floor);
		}
		if (position.x < 0.4) {
			position = new CORE.Vector2d(0.4, position.y);
		}
		this.transform.setPosition(position);
	}
}

class Collector extends CORE.GameComponent {
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

class Mover extends CORE.GameComponent {
	constructor(speed, left, right) {
		super();
		this.speed = speed;
		this.left = left;
		this.right = right;
		this.target = left;
	}

	onInitialize() {
		/**
		 * @type {CORE.RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(CORE.RigidBody);
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

export default class Test extends CORE.Scene {
	onInitialize() {
		this.resources.addImageInLoadQueue('graphic', 'resources/graphic.png');
		this.resources.addImageInLoadQueue('ball', 'resources/ball.png');
		this.resources.addImageInLoadQueue('coin', 'resources/coin.png');
		this.resources.addImageInLoadQueue('spike', 'resources/spike.png');
		this.resources.addImageInLoadQueue('rail', 'resources/rail.png');
		this.resources.addImageInLoadQueue('hero', 'resources/hero.png');
		this.resources.addSoundInLoadQueue('nature', 'resources/nature.mp3');
		this.resources.addSoundInLoadQueue('theme', 'resources/theme.mp3');
	}

	createCoin(position) {
		this.addObject(new CORE.GameObject({
			name: 'coin',
			isStatic: true,
			position: position,
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('coin')), 2),
				new CORE.CircleCollider(0.5),
			],
		}));
	}

	createInvisibleWall(position, scale) {
		this.addObject(new CORE.GameObject({
			name: 'invisibleWall',
			isStatic: true,
			scale: scale,
			position: position,
			components: [
				new CORE.BoxCollider(1, 300),
				new CORE.RigidBody({
					material: new CORE.Material(1, 0),
				}),
			],
		}));
	}

	createRailSpike(speed, position, size = 1, rotation = 0, isRandom = false) {
		let a = null;
		this.addObject(a = new CORE.GameObject({
			name: 'rail',
			position: position,
			rotation: rotation,
			scale: new CORE.Vector2d(size, 1),
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('rail')), 2),
			],
		}));
		const min = -0.45;
		const max = 0.45;
		let left = a.transform.transformPoint(new CORE.Vector2d(min, 0.06));
		left = new CORE.Vector2d(left.x, -left.y);
		let right = a.transform.transformPoint(new CORE.Vector2d(max, 0.06));
		right = new CORE.Vector2d(right.x, -right.y);
		let spawn = null;
		if (isRandom) {
			let spawn = a.transform.transformPoint(new CORE.Vector2d(min + Math.random() * (max - min), 0.06));
			spawn = new CORE.Vector2d(spawn.x, -spawn.y);
		} else {
			spawn = a.transform.transformPoint(new CORE.Vector2d(0, 0.06));
			spawn = new CORE.Vector2d(spawn.x, -spawn.y);
		}
		this.addObject(new CORE.GameObject({
			name: 'spike',
			scale: new CORE.Vector2d(2, 2),
			rotation: rotation,
			position: spawn,
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('spike')), 2),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0),
					isKinematic: true,
				}),
				new Mover(speed, left, right),
				new CORE.BoxCollider(0.31 / 2, 0.48),
			],
		}));
	}

	createBall(position) {
		for (let i = 0; i < 2; i++) {
			this.addObject(new CORE.GameObject({
				name: 'ball',
				position: new CORE.Vector2d(position.x + (i * 2), position.y),
				components: [
					new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('ball')), 3),
					new CORE.CircleCollider(0.5),
					new CORE.RigidBody({
						material: new CORE.Material(0.5, 0.5),
					}),
					new Rotater(3),
				],
			}));
		}
		this.addObject(new CORE.GameObject({
			name: 'ball',
			position: position.subtract(new CORE.Vector2d(2, 0)),
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('ball')), 3),
				new CORE.CircleCollider(0.5),
				new CORE.RigidBody({
					material: new CORE.Material(0.1, 0.5),
				}),
				new Rotater(3),
			],
		}));
	}

	createBallRain() {
		for (let i = -15; i < 15; i++) {
			this.addObject(new CORE.GameObject({
				name: 'ball',
				position: new CORE.Vector2d(this.hero.transform.position.x + (i * 2), 10),
				components: [
					new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('ball')), 3),
					new CORE.CircleCollider(0.5),
					new CORE.RigidBody({
						material: new CORE.Material(0.5, 0.5),
						velocity: new CORE.Vector2d(-i, Math.random() * i * 2),
					}),
					new Rotater(3),
				],
			}));
		}
	}

	onStart() {
		CORE.Screen.setSize(new CORE.Vector2d(1280, 720));
		const ss = new CORE.SpriteSheet(
			this.resources.getImage('graphic'),
			['3', new CORE.Rect(16, 0, 16, 16)],
			['1', new CORE.Rect(32, 0, 16, 16)],
			['2', new CORE.Rect(48, 0, 16, 16)],
			['01', new CORE.Rect(16, 16, 16, 16)],
			['001', new CORE.Rect(16, 16, 3, 16)],
			['00', new CORE.Rect(64, 16, 16, 16)],
			['000', new CORE.Rect(64, 16, 3,16)],
			['ladders', new CORE.Rect(64, 0, 16, 16)]
		)
		const ssh = new CORE.SpriteSheet(
			this.resources.getImage('hero'),
			['walk', new CORE.Rect(0, 0, 16, 32)],
			['walk1', new CORE.Rect(16, 0, 16, 32)],
			['walk2', new CORE.Rect(32, 0, 16, 32)],
			['walk3', new CORE.Rect(48, 0, 16, 32)]
		)
		this.hero = new CORE.GameObject({
			name: 'hero',
			scale: new CORE.Vector2d(4, 4),
			position: new CORE.Vector2d(-3.5, 4),
			components: [
				new CORE.SpriteRenderer(ssh.get('walk')),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0),
					gravityScale: 3,
				}),
				new CORE.Animator([
					['walk', new CORE.Animation(0.5, true, [
						new CORE.SpriteKeyFrame(ssh.get('walk1'), 0),
						new CORE.SpriteKeyFrame(ssh.get('walk2'), 0.15),
						new CORE.SpriteKeyFrame(ssh.get('walk3'), 0.3),
						new CORE.SpriteKeyFrame(ssh.get('walk'), 0.5),
					])],
					['idle', new CORE.Animation(1, false, [
						new CORE.SpriteKeyFrame(ssh.get('walk'), 0),
					])],
				], 'idle'),
				new CORE.BoxCollider(0.16, 0.32),
				new Controller(),
				new Collector(),
				new Player(3, 10),
			],
		});
		this.addObject(new CORE.GameObject({
			name: 'sounds',
			components: [
				new CORE.AudioPlayer({
					volume: 0.5,
					loop: true,
					playbackRate: 1,
					sound: this.resources.getSound('nature'),
					isSpatialSound: false,
					playOnInitialize: true
				}),
				new CORE.AudioPlayer({
					volume: 0.5,
					loop: true,
					playbackRate: 1,
					sound: this.resources.getSound('theme'),
					isSpatialSound: false,
					playOnInitialize: true
				})
			],
		}));

		this.addObject(new CORE.GameObject({
			name: 'platform',
			scale: new CORE.Vector2d(1, 1),
			position: new CORE.Vector2d(33.8, -0.6),
			isStatic: true,
			components: [
				new CORE.TileMap(16, 16, ss, [
					['1', '2', '2', '2', '2', '2', '2', '3', null, null, null, null, null, null, null, null, null, null, null, '1', '2', '2', '2', '2', '3'],
					['01', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '1', '2', '3'],
					['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '3'],
					['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '1', '2', '2', '2', '2', '2', '2', '2', '2', '3', null, null, null, null, null, '1', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '3'],
					['2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '3', null, null, null, '1', '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', null, null, null, null, null, '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01'  ],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '01', '01', '01', '01' ]
				]),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0)
				}),
				new CORE.TileMapCollider()
			]
		}))
		this.addObject(new CORE.GameObject({
			name: 'platform',
			scale: new CORE.Vector2d(1, 1),
			position: new CORE.Vector2d(5.8, 0.4),
			isStatic: true,
			components: [
				new CORE.TileMap(16, 16, ss, [
					[null, null, null, null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '01', '01', '01', '01', '01', '01'],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '00', '00', '00', '00', '00', '00'],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '00', '00', null, null, null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '00', '00', '01', '01', '01', '01', '01', '01'],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '00', '00', '00', '00', '00', '00']
				]),
			]
		}))
		this.addObject(new CORE.GameObject({
			name: 'ladders',
			scale: new CORE.Vector2d(1, 1),
			position: new CORE.Vector2d(12.5, 1.41),
			components: [
				new CORE.BoxCollider(0.1, 1),
			],
			children: [
				new CORE.GameObject({
					name: 'ladder-sprite',
					position: new CORE.Vector2d(0, 0),
					components: [
						new CORE.TileMap(16, 16, ss, [
							['ladders'],
							['ladders'],
							['ladders'],
							['ladders']
						]),
					]
				})
			]
		}));
		this.addObject(this.hero);
		this.createRailSpike(5, new CORE.Vector2d(-3, -1.8), 4);
		this.createRailSpike(3, new CORE.Vector2d(-6.3, -0.1), 4, Math.PI / 2);
		this.createRailSpike(5, new CORE.Vector2d(-3, 1.6), 4, Math.PI);
		this.createCoin(new CORE.Vector2d(-6, -1.5));
		this.createCoin(new CORE.Vector2d(16, 4));
		this.createCoin(new CORE.Vector2d(24, 4));
		this.createBall(new CORE.Vector2d(-2, 3));
		this.createBall(new CORE.Vector2d(35, 0));
		this.createCoin(new CORE.Vector2d(50, 0));
		this.createRailSpike(5, new CORE.Vector2d(50, -0.8), 4)
		this.createRailSpike(3, new CORE.Vector2d(55, -0.8), 5)
		this.createCoin(new CORE.Vector2d(55, 0));
		this.addObject(new CORE.Camera({
			name: 'camera',
			scale: new CORE.Vector2d(0.8, 0.8),
			clearColor: new CORE.Color(156, 180, 219),
			components: [
				new Follower(this.hero),
			],
		}));
		this.addObject(new CORE.UIObject({
			tag: 'div',
			name: 'countsContainer',
			id: 'countsContainer',
			children: [
				new CORE.UIObject({
					tag: 'div',
					name: 'lifeContainer',
					id: 'lifeContainer',
					children: [
						new CORE.UIObject({
							tag: 'div',
							name: 'lifeText',
							id: 'lifeText',
							innerText: 'Жизни:',
						}),
						new CORE.UIObject({
							tag: 'div',
							name: 'life',
							id: 'life',
							components: [
								new UILifeCount(this.hero),
							],
						}),
					],
				}),
				new CORE.UIObject({
					tag: 'div',
					name: 'coinsContainer',
					id: 'coinsContainer',
					children: [
						new CORE.UIObject({
							tag: 'div',
							name: 'coinsText',
							id: 'coinsText',
							innerText: 'Монетки:',
						}),
						new CORE.UIObject({
							tag: 'div',
							name: 'coins',
							id: 'coins',
							components: [
								new UICoinsCount(this.hero),
							],
						}),
					],
				}),
			],
		}));
		this.addObject(new CORE.UIObject({
			tag: 'button',
			name: 'close',
			innerText: 'Меню',
			id: 'closeButton',
		}));
		this.addObject(new CORE.UIObject({
			tag: 'div',
			name: 'open',
			id: 'openMenu',
			children: [
				new CORE.UIObject({
					tag: 'div',
					name: 'about',
					id: 'about',
					innerHTML: '<h1>IndieDevs</h1><hr><h2>Игра-платформер</h2><hr><p>Демо-версия игры, где показаны возможности ядра и некоторые основные механики (механики передвижения, собирания монеток, смерти).</p><h2>Описание демо-версии игры:</h2><hr><ol><li>У игрока есть 3 жизни, при потере которых игра начинается сначала.</li><li>Жизни теряются при столкновении с шипами, прыжке с высокой платформы.</li><li>При падении в пропасть игра начинается сначала.</li><li>Игра считается пройденной при подбирании всех монеток на уровне (их всего 5).</li></ol><h2>Команда</h2><hr><ul><li>Игорь Бахтин (капитан) <a href="https://github.com/igor-vgs">@igor-vgs</a></li><li>Дмитрий Балакин (разработчик ядра игры) <a href="https://github.com/Trequend">@Trequend</a></li><li>Егор Смирнов (разработчик ядра игры) <a href="https://github.com/SmEgDm">@SmEgDm</a></li><li>Александра Пастухова <a href="https://github.com/caapricorn">@caapricorn</a></li><li>Гиорги Шаликиани <a href="https://github.com/gioshek">@gioshek</a></li><li>Лада Еникеева <a href="https://github.com/l-en">@l-en</a></li><li>Азамат Гимазов <a href="https://github.com/Azarolol">@Azarolol</a></li><li>Владислав Бровкин <a href="https://github.com/vladb000">@vladb000</a></li></ul><h2>Инструкция пользователя:</h2><hr><ul type="disc"><li>A, D - движение влево и вправо</li><li>W, S - движение вверх и вниз по лестнице</li><li>Space - прыжок</li></ul>',
				}),
				new CORE.UIObject({
					tag: 'div',
					name: 'audio',
					id: 'audio',
					innerHTML: '<input type="range" min="0" max="100" step="1" value="50">',
				}),
				new CORE.UIObject({
					tag: 'ul',
					name: 'navbar',
					id: 'navbar',
					children: [
						new CORE.UIObject({
							tag: 'li',
							name: 'liAbout',
							children: [
								new CORE.UIObject({
									tag: 'button',
									name: 'about',
									innerText: 'Об игре',
								}),	
							],
						}),
						new CORE.UIObject({
							tag: 'li',
							name: 'liAudio',
							children: [
								new CORE.UIObject({
									tag: 'button',
									name: 'audio',
									innerText: 'Звук',
								}),
							],
						}),
						new CORE.UIObject({
							tag: 'li',
							name: 'liClose',
							children: [
								new CORE.UIObject({
									tag: 'button',
									name: 'closing',
									innerText: 'Закрыть',
									id: 'closeMenu',
								}),
							],
						}),
					],
				}),
			],
		}));
	}
}
