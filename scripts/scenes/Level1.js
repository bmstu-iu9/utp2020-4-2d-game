import * as CORE from '../core/Core.js';

class UICoinsCount extends CORE.UIComponent {
	constructor(hero) {
		super();
		this.hero = hero;
		this.currentValue = null;
	}

	onInitialize() {
		this.collector = this.hero.getComponent(Collector);
	}

	onUpdate() {
		if (this.currentValue !== this.collector.coinsCount) {
			this.uiObject.setInnerText(`${this.collector.coinsCount}`);
			this.currentValue = this.collector.coinsCount;
		}
	}
}

class UILifeCount extends CORE.UIComponent {
	constructor(hero) {
		super();
		this.hero = hero;
		this.currentValue = null;
	}

	onInitialize() {
		this.player = this.hero.getComponent(Player);
	}

	onUpdate() {
		if (this.currentValue !== this.player.lifeCount) {
			this.uiObject.setInnerText(`${this.player.lifeCount}`);
			this.currentValue = this.player.lifeCount;
		}
	}
}

class UIMenuButton extends CORE.UIComponent {
	onInitialize() {
		const component = this;
		this.uiObject.addEventListener('click', () => {
			if (component.uiObject.htmlObject.style.display == 'flex') {
				document.getElementById(`countsContainer`).style.display = 'none';
				component.uiObject.htmlObject.style.display = 'none';
				document.getElementById(`menu`).style.display = 'flex';
			}
		});
	}
}

class UICloseButton extends CORE.UIComponent {
	onInitialize() {
		const component = this;
		this.uiObject.addEventListener('click', () => {
			if (document.getElementById(`menu`).style.display == 'flex') {
				document.getElementById(`menu`).style.display = 'none';
				document.getElementById(`countsContainer`).style.display = 'flex';
				document.getElementById(`menuButton`).style.display = 'flex';
			}
		});
	}
}

class UIAboutButton extends CORE.UIComponent {
	onInitialize() {
		const component = this;
		this.uiObject.addEventListener('click', () => {
			if (document.getElementById(`about`).style.display == 'none') {
				document.getElementById(`audio`).style.display = 'none';
				document.getElementById(`about`).style.display = 'block';
			}
		});
	}
}

class UIAudioButton extends CORE.UIComponent {
	onInitialize() {
		const component = this;
		this.uiObject.addEventListener('click', () => {
			if (document.getElementById(`audio`).style.display == 'none') {
				document.getElementById(`about`).style.display = 'none';
				document.getElementById(`audio`).style.display = 'flex';
			}
		});
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
				if (CORE.Input.getKeyPressed('KeyW')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(this.rigidBody.velocity.x, 3));
				} else if (CORE.Input.getKeyPressed('KeyS')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(this.rigidBody.velocity.x, -3));
				} else {
					this.rigidBody.setVelocity(new CORE.Vector2d(this.rigidBody.velocity.x, 0));
				}
				if (CORE.Input.getKeyPressed('KeyA')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(-3, this.rigidBody.velocity.y));
				} else if (CORE.Input.getKeyPressed('KeyD')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(3, this.rigidBody.velocity.y));
				} else {
					this.rigidBody.setVelocity(new CORE.Vector2d(0, this.rigidBody.velocity.y));
				}
			} else {
				if (CORE.Input.getKeyPressed('KeyA')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(-5, this.rigidBody.velocity.y));
				} else if (CORE.Input.getKeyPressed('KeyD')) {
					this.rigidBody.setVelocity(new CORE.Vector2d(5, this.rigidBody.velocity.y));
				} else {
					this.rigidBody.setVelocity(new CORE.Vector2d(0, this.rigidBody.velocity.y));
				}
				if (CORE.Input.getKeyDown('Space') && this.canJump) {
					this.rigidBody.addForce(new CORE.Vector2d(0, 750));
					this.canJump = false;
				}
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
		this.floor = 1.3;
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

export default class Level1 extends CORE.Scene {
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
		this.resources.addTextInLoadQueue('description', 'resources/html_fragments/description.html');
	}

	createPlatform(position, scale) {
		this.addObject(new CORE.GameObject({
			name: 'platform',
			isStatic: true,
			scale: scale,
			position: position,
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('platform')), -3),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0.6),
				}),
				new CORE.BoxCollider(1, 1),
			],
		}));
	}

	createHouse() {
		this.addObject(new CORE.GameObject({
			name: 'ladder',
			scale: new CORE.Vector2d(1, 1.65),
			position: new CORE.Vector2d(25, 5.5),
			components: [
				new CORE.BoxCollider(0.2, 2.48),
			],
			children: [
				new CORE.GameObject({
					name: 'ladder-sprite',
					position: new CORE.Vector2d(0, -0.3),
					components: [
						new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('ladder')), -1),
					]
				})
			]
		}));
		this.addObject(new CORE.GameObject({
			name: 'ladder',
			scale: new CORE.Vector2d(1, 1.65),
			position: new CORE.Vector2d(36, 5.5),
			components: [
				new CORE.BoxCollider(0.2, 2.48),
			],
			children: [
				new CORE.GameObject({
					name: 'ladder-sprite',
					position: new CORE.Vector2d(0, -0.3),
					components: [
						new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('ladder')), -1),
					]
				})
			]
		}));
		this.addObject(new CORE.GameObject({
			name: 'roof',
			position: new CORE.Vector2d(30, 7),
			isStatic: true,
			components: [
				new CORE.BoxCollider(15, 1),
				new CORE.RigidBody({
					material: new CORE.Material(0.2, 0.4),
				}),
			],
		}));
		this.addObject(new CORE.GameObject({
			name: 'roof',
			position: new CORE.Vector2d(30, 7.2),
			scale: new CORE.Vector2d(15, 1),
			isStatic: true,
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('platform')), 2),
			],
		}));
		this.createCoin(new CORE.Vector2d(32, 8.5));
		this.addObject(new CORE.GameObject({
			name: 'house',
			isStatic: true,
			scale: new CORE.Vector2d(15, 15),
			position: new CORE.Vector2d(30, 0),
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('house')), -4),
			],
		}));
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
		this.hero = new CORE.GameObject({
			name: 'hero',
			scale: new CORE.Vector2d(1, 1),
			position: new CORE.Vector2d(0, -2),
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('hero'))),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0),
					gravityScale: 3,
				}),
				new CORE.BoxCollider(1, 1),
				new Controller(),
				new Collector(),
				new Player(3, 10),
			],
		});
		this.createPlatform(new CORE.Vector2d(-3, 2), new CORE.Vector2d(10, 1));
		this.createPlatform(new CORE.Vector2d(-7.3, 0), new CORE.Vector2d(1, 100));
		this.createRailSpike(5, new CORE.Vector2d(-3, -2), 4);
		this.createRailSpike(3, new CORE.Vector2d(-6.3, -0.5), 4, Math.PI / 2);
		this.createRailSpike(5, new CORE.Vector2d(-3, 1), 4, Math.PI);
		this.addObject(this.hero);
		this.createBall(new CORE.Vector2d(-2, 3));
		this.createCoin(new CORE.Vector2d(-6, -1.85));
		this.createCoin(new CORE.Vector2d(16, 3));
		this.createPlatform(new CORE.Vector2d(-3, -3), new CORE.Vector2d(10, 1));
		this.createInvisibleWall(new CORE.Vector2d(-8.12, 0), new CORE.Vector2d(1, 1));
		this.createPlatform(new CORE.Vector2d(8, -3), new CORE.Vector2d(5, 1));
		this.createPlatform(new CORE.Vector2d(20, -2), new CORE.Vector2d(15, 4));
		this.createBall(new CORE.Vector2d(40, 0));
		this.createPlatform(new CORE.Vector2d(39.5, -2), new CORE.Vector2d(10, 4));
		this.createPlatform(new CORE.Vector2d(48, 2), new CORE.Vector2d(3, 1));
		this.createPlatform(new CORE.Vector2d(46, -4), new CORE.Vector2d(6, 4));
		this.createCoin(new CORE.Vector2d(59, 3));
		this.createRailSpike(5, new CORE.Vector2d(59, 0.5), 4)
		this.createPlatform(new CORE.Vector2d(58, -2), new CORE.Vector2d(10, 4));
		this.createPlatform(new CORE.Vector2d(65, 2), new CORE.Vector2d(3, 1));
		this.createPlatform(new CORE.Vector2d(73, -2), new CORE.Vector2d(10, 10));
		this.createRailSpike(3, new CORE.Vector2d(73, 3.5), 5)
		this.createPlatform(new CORE.Vector2d(87, -2), new CORE.Vector2d(10, 10));
		this.createCoin(new CORE.Vector2d(107, 5));
		this.createPlatform(new CORE.Vector2d(106, -2), new CORE.Vector2d(20, 10));
		this.createHouse();
		this.addObject(new CORE.Camera({
			name: 'camera',
			scale: new CORE.Vector2d(0.8, 0.8),
			clearColor: new CORE.Color(156, 180, 219),
			components: [
				new Follower(this.hero),
			],
		}));
		const ui = new CORE.UIObject({id: 'ui', tag: 'div'});
		const countsContainer = new CORE.UIObject({
			tag: 'div',
			id: 'countsContainer',
			children: [
				new CORE.UIObject({
					tag: 'div',
					id: 'lifeContainer',
					children: [
						new CORE.UIObject({
							tag: 'div',
							id: 'lifeText',
							innerText: 'Жизни:',
						}),
						new CORE.UIObject({
							tag: 'div',
							id: 'life',
							components: [
								new UILifeCount(this.hero),
							],
						}),
					],
				}),
				new CORE.UIObject({
					tag: 'div',
					id: 'coinsContainer',
					children: [
						new CORE.UIObject({
							tag: 'div',
							id: 'coinsText',
							innerText: 'Монетки:',
						}),
						new CORE.UIObject({
							tag: 'div',
							id: 'coins',
							components: [
								new UICoinsCount(this.hero),
							],
						}),
					],
				}),
			],
		});
		const menuButton = new CORE.UIObject({
			tag: 'button',
			id: 'menuButton',
			innerText: 'Меню',
			components: [
				new UIMenuButton(),
			],
		});
		const about = new CORE.UIObject({
			tag: 'div',
			id: 'about',
			innerHTML: '<h1>IndieDevs</h1><hr><h2>Игра-платформер</h2><hr><p>Демо-версия игры, где показаны возможности ядра и некоторые основные механики (механики передвижения, собирания монеток, смерти).</p><h2>Описание демо-версии игры:</h2><hr><ol><li>У игрока есть 3 жизни, при потере которых игра начинается сначала.</li><li>Жизни теряются при столкновении с шипами, прыжке с высокой платформы.</li><li>При падении в пропасть игра начинается сначала.</li><li>Игра считается пройденной при подбирании всех монеток на уровне (их всего 5).</li></ol><h2>Команда</h2><hr><ul><li>Игорь Бахтин (капитан) <a href="https://github.com/igor-vgs">@igor-vgs</a></li><li>Дмитрий Балакин (разработчик ядра игры) <a href="https://github.com/Trequend">@Trequend</a></li><li>Егор Смирнов (разработчик ядра игры) <a href="https://github.com/SmEgDm">@SmEgDm</a></li><li>Александра Пастухова <a href="https://github.com/caapricorn">@caapricorn</a></li><li>Гиорги Шаликиани <a href="https://github.com/gioshek">@gioshek</a></li><li>Лада Еникеева <a href="https://github.com/l-en">@l-en</a></li><li>Азамат Гимазов <a href="https://github.com/Azarolol">@Azarolol</a></li><li>Владислав Бровкин <a href="https://github.com/vladb000">@vladb000</a></li></ul><h2>Инструкция пользователя:</h2><hr><ul type="disc"><li>A, D - движение влево и вправо</li><li>W, S - движение вверх и вниз по лестнице</li><li>Space - прыжок</li></ul>',
		});
		const audio = new CORE.UIObject({
			tag: 'div',
			id: 'audio',
			children: [
				new CORE.UIObject({
					name: 'volume',
					tag: 'input',
					attributes: [
						{name: 'type', value: 'range'},
						{name: 'min', value: '0'},
						{name: 'max', value: '100'},
						{name: 'step', value: '1'},
						{name: 'value', value: '50'},
					],
				}),
			],
		});
		const menu = new CORE.UIObject({
			tag: 'div',
			id: 'menu',
			children: [
				about,
				audio,
				new CORE.UIObject({
					tag: 'ul',
					id: 'navbar',
					children: [
						new CORE.UIObject({
							tag: 'li',
							name: 'liAbout',
							children: [
								new CORE.UIObject({
									tag: 'button',
									name: 'about',
									id: 'aboutButton',
									innerText: 'Об игре',
									components: [
										new UIAboutButton(),
									],
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
									id: 'audioButton',
									innerText: 'Звук',
									components: [
										new UIAudioButton(),
									],
								}),
							],
						}),
						new CORE.UIObject({
							tag: 'li',
							name: 'liClose',
							children: [
								new CORE.UIObject({
									tag: 'button',
									innerText: 'Закрыть',
									id: 'closeButton',
									components: [
										new UICloseButton(),
									]
								}),
							],
						}),
					],
				}),
			],
		});
		this.addObject(ui);
		ui.addChild(countsContainer);
		ui.addChild(menuButton);
		ui.addChild(menu);
		countsContainer.htmlObject.style.display = 'flex';
		menuButton.htmlObject.style.display = 'flex';
		menu.htmlObject.style.display = 'none';
		about.htmlObject.style.display = 'block';
		audio.htmlObject.style.display = 'none';
	}
}
