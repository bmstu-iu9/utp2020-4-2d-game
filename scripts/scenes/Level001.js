import * as CORE from '../core/Core.js';
import * as MECH from '../mechanics/Mechanics.js'
import Level002 from './Level002.js';

export default class Level001 extends CORE.Scene {
	onInitialize() {
		this.resources.addImageInLoadQueue('graphic', 'resources/graphic.png');
		this.resources.addImageInLoadQueue('ball', 'resources/ball.png');
		this.resources.addImageInLoadQueue('coin', 'resources/coin.png');
		this.resources.addImageInLoadQueue('spike', 'resources/spike.png');
		this.resources.addImageInLoadQueue('rail', 'resources/rail.png');
		this.resources.addImageInLoadQueue('hero', 'resources/hero.png');
		this.resources.addSoundInLoadQueue('nature', 'resources/nature.mp3');
		this.resources.addSoundInLoadQueue('theme', 'resources/theme.mp3');
		this.resources.addTextInLoadQueue('description', 'resources/html_fragments/description.html');
		this.resources.addImageInLoadQueue('checkPoint', 'resources/checkPoint.png');
		this.resources.addImageInLoadQueue('turrel', 'resources/turrel.png');
		this.resources.addImageInLoadQueue('laser', 'resources/laser.png');
		this.resources.addImageInLoadQueue('trampoline', 'resources/trampoline.png');
		this.resources.addImageInLoadQueue('extraLife', 'resources/extraLife.png');
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
				new MECH.Mover(speed, left, right),
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
					new MECH.Rotater(3),
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
				new MECH.Rotater(3),
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
					new MECH.Rotater(3),
				],
			}));
		}
	}

	createCheckPoint(position) {
		this.addObject(new CORE.GameObject({
			name: 'checkPoint',
			isStatic: true,
			scale: new CORE.Vector2d(0.5, 0.5),
			position: position,
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('checkPoint')), 1),
				new CORE.BoxCollider(1, 1),
			],
		}));
	}

	createTurrel(position, rotation, speed, timer) {
		this.addObject(new CORE.GameObject({
			name: 'turrel',
			isStatic: true,
			scale: new CORE.Vector2d(0.3, 0.3),
			position: position,
			rotation: rotation,
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('turrel')), 1),
				new CORE.BoxCollider(4, 3.4),
				new CORE.RigidBody({
					material: new CORE.Material(1, 0),
				}),
				new MECH.Turrel(position, rotation, speed, timer),
			],
		}));
	}

	createTrampoline(position) {
		this.addObject(new CORE.GameObject({
			name: 'trampoline',
			isStatic: true,
			scale: new CORE.Vector2d(0.3, 0.3),
			position: position,
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('trampoline')), 1),
				new CORE.BoxCollider(5.14, 2.02),
				new CORE.RigidBody({
					material: new CORE.Material(1, 1),
				}),
			],
		}));
	}

	createExtraLife(position) {
		this.addObject(new CORE.GameObject({
			name: 'extraLife',
			isStatic: true,
			scale: new CORE.Vector2d(0.3, 0.3),
			position: position,
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('extraLife')), 1),
				new CORE.CircleCollider(4.64 / 2),
			],
		}));
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
				new MECH.Controller(),
				new MECH.Collector(),
				new MECH.Player(5, new CORE.Vector2d(-3.5, 4)),
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
			position: new CORE.Vector2d(12.5, 0.5),
			components: [
				new CORE.BoxCollider(0.1, 4),
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
                            ['ladders'],
                            ['ladders']
						]),
					]
				})
			]
		}));
		this.addObject(this.hero);
		this.createRailSpike(3.5, new CORE.Vector2d(-3, -1.8), 4);
		this.createRailSpike(2, new CORE.Vector2d(-6.3, -0.1), 4, Math.PI / 2);
		this.createRailSpike(3.5, new CORE.Vector2d(-3, 1.6), 4, Math.PI);
		this.createCoin(new CORE.Vector2d(-6, -1.5));
		this.createCoin(new CORE.Vector2d(16, 4));
		this.createExtraLife(new CORE.Vector2d(17, 0.5));
		this.createCoin(new CORE.Vector2d(24, 4));
		this.createCheckPoint(new CORE.Vector2d(23, 3));
		this.createBall(new CORE.Vector2d(-2, 3));
		this.createBall(new CORE.Vector2d(35, 0));
		this.createCoin(new CORE.Vector2d(50, 0));
		this.createTurrel(new CORE.Vector2d(60, 0), 0, 2.5, 5);
		this.createRailSpike(2.5, new CORE.Vector2d(50, -0.8), 4)
		this.createRailSpike(3, new CORE.Vector2d(55, -0.8), 5)
		this.createCoin(new CORE.Vector2d(55, 0));
		this.addObject(new CORE.GameObject({
			name: 'door',
			position: new CORE.Vector2d(65, 0),
			scale: new CORE.Vector2d(0.5, 0.5),
			components: [
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('extraLife'))),
				new MECH.Door(Level002, this.hero),
				new CORE.CircleCollider(2.27),
			]
		}));
		this.addObject(new CORE.Camera({
			name: 'camera',
			scale: new CORE.Vector2d(0.8, 0.8),
			clearColor: new CORE.Color(156, 180, 219),
			components: [
				new MECH.Follower(this.hero),
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
								new MECH.UILifeCount(this.hero),
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
								new MECH.UICoinsCount(this.hero),
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
				new MECH.UIMenuButton(),
			],
		});
		const about = new CORE.UIObject({
			tag: 'div',
			id: 'about',
			innerHTML: this.resources.getText('description'),
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
									innerText: 'Об игре',
									components: [
										new MECH.UIAboutButton(),
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
									innerText: 'Звук',
									components: [
										new MECH.UIAudioButton(),
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
									id: 'closeMenu',
									components: [
										new MECH.UICloseButton(),
									],
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
