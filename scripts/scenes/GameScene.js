import * as CORE from '../core/Core.js';
import * as MECH from '../mechanics/Mechanics.js';

export default class GameScene extends CORE.Scene {
	createHero(position, gravityScale) {
		const ss = CORE.Game.resources.getTiles('tileset');
		const hero = new CORE.GameObject({
			name: 'hero',
			scale: new CORE.Vector2d(0.8, 0.8),
			position,
			components: [
				new CORE.SpriteRenderer({
					sprite: ss.get('hero'),
					layer: 2,
				}),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0),
					gravityScale,
				}),
				new CORE.Animator([
					['walk', new CORE.Animation(0.7, true, [
						new CORE.SpriteKeyFrame(ss.get('walk'), 0.0),
						new CORE.SpriteKeyFrame(ss.get('walk1'), 0.1),
						new CORE.SpriteKeyFrame(ss.get('walk2'), 0.2),
						new CORE.SpriteKeyFrame(ss.get('walk3'), 0.3),
						new CORE.SpriteKeyFrame(ss.get('walk4'), 0.4),
						new CORE.SpriteKeyFrame(ss.get('walk5'), 0.5),
						new CORE.SpriteKeyFrame(ss.get('walk6'), 0.6),
						
					])],
					['idle', new CORE.Animation(1, false, [
						new CORE.SpriteKeyFrame(ss.get('hero'), 0),
					])],
				], 'idle'),
				new CORE.BoxCollider(0.8, 2),
				new MECH.Collector(),
				new MECH.Player(5, position),
			],
		});
		this.addObject(hero);
		return hero;
	}

	createSounds() {
		const sounds = new CORE.GameObject({
			name: 'sounds',
			components: [
				new CORE.AudioPlayer({
					volume: 0.025,
					loop: true,
					playbackRate: 1,
					sound: CORE.Game.resources.getSound('nature'),
					isSpatialSound: false,
					playOnInitialize: true
				}),
				new CORE.AudioPlayer({
					volume: 0.025,
					loop: true,
					playbackRate: 1,
					sound: CORE.Game.resources.getSound('theme'),
					isSpatialSound: false,
					playOnInitialize: true
				})
			],
		});
		this.addObject(sounds);
		return sounds;
	}

	createLadder(position, size) {
		const tiles = [];
		for (let i = 0; i < size; i++) {
			tiles.push(['ladder']);
		}
		const ladder = new CORE.GameObject({
			name: 'ladder',
			position: position.add(new CORE.Vector2d(0, 1.8)),
			components: [
				new CORE.BoxCollider(0.2, size - 1.5),
			],
			children: [
				new CORE.GameObject({
					name: 'ladder-sprite',
					position: new CORE.Vector2d(1, -0.8),
					components: [
						new CORE.TileMap({
							color: new CORE.Color(240, 215, 175),
							spriteSheets: [CORE.Game.resources.getTiles('tileset')],
							map: tiles,
						}),
					]
				})
			]
		});
		this.addObject(ladder);
		return ladder;
	}

	createCamera(hero, floor) {
		const size = new CORE.Vector2d(document.body.clientWidth, document.body.clientHeight);
		const camera = new CORE.Camera({
			name: 'camera',
			width: size.x,
			height: size.y,
			zoom: 4,
			clearColor: new CORE.Color(156, 180, 219),
			components: [
				new MECH.Follower(hero, floor),
				new MECH.Resizer(),
			],
		});
		this.addObject(camera);
		return camera;
	}

	createDoor(position, nextLevel, hero) {
		const ss = CORE.Game.resources.getTiles('tileset');
		const door = new CORE.GameObject({
			name: 'door',
			position,
			scale: new CORE.Vector2d(0.4, 0.4),
			components: [
				new CORE.SpriteRenderer({
					sprite: CORE.Game.resources.getTiles('tileset').get('door'),
				}),
				new MECH.Door(nextLevel, hero),
				new CORE.CircleCollider(2.27),
			],
			children: [
				new CORE.GameObject({
					name: 'finish',
					position: new CORE.Vector2d(0, 4),
					scale: new CORE.Vector2d(1.5, 1.5),
					components: [
						new CORE.SpriteRenderer({sprite: ss.get('finish1'), layer: -1}),
						new CORE.Animator([
							['finish', new CORE.Animation(0.09, true, [
								new CORE.SpriteKeyFrame(ss.get('finish1'), 0),
								new CORE.SpriteKeyFrame(ss.get('finish2'), 0.1)
							])],
							['idle', new CORE.Animation(1, false, [
								new CORE.SpriteKeyFrame(ss.get('finish1'), 0),
							])],
						], 'idle'),
					],
				}),
			],
		});
		this.addObject(door);
		return door;
	}

	createUI(hero, deadline) {
		const ui = new CORE.UIObject({id: 'ui', tag: 'div'});
		const leftButton = new CORE.UIObject({
			id: 'leftButton',
			tag: 'button',
			innerText: '<',
		});
		const rightButton = new CORE.UIObject({
			id: 'rightButton',
			tag: 'button',
			innerText: '>',
		});
		const topButton = new CORE.UIObject({
			id: 'topButton',
			tag: 'button',
			innerHTML: '<p>></p>',
		});
		const bottomButton = new CORE.UIObject({
			id: 'bottomButton',
			tag: 'button',
			innerHTML: '<p>></p>',
		});
		const jumpButton = new CORE.UIObject({
			id: 'jumpButton',
			tag: 'button',
			innerText: 'Прыжок',
		});
		ui.addChild(leftButton);
		ui.addChild(rightButton);
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
								new MECH.UILifeCount(hero),
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
								new MECH.UICoinsCount(hero),
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
			innerHTML: CORE.Game.resources.getText('description'),
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
		const topPanel = new CORE.UIObject({
			id: 'topPanel',
			tag: 'div',
			children: [countsContainer, menuButton],
		});
		const horizontalMoveButtons = new CORE.UIObject({
			id: 'horizontalMoveButtons',
			tag: 'div',
			children: [leftButton, rightButton],
		});
		const verticalMoveButtons = new CORE.UIObject({
			id: 'verticalMoveButtons',
			tag: 'div',
			children: [topButton, bottomButton, jumpButton],
		});
		const bottomPanel = new CORE.UIObject({
			id: 'bottomPanel',
			tag: 'div',
			children: [horizontalMoveButtons, verticalMoveButtons],
		});
		this.addObject(ui);
		ui.addChild(topPanel);
		ui.addChild(bottomPanel);
		ui.addChild(menu);
		hero.addComponent(
			new MECH.Controller(deadline, leftButton, rightButton, topButton, bottomButton, jumpButton),
		);
		countsContainer.htmlObject.style.display = 'flex';
		menuButton.htmlObject.style.display = 'flex';
		menu.htmlObject.style.display = 'none';
		about.htmlObject.style.display = 'block';
		audio.htmlObject.style.display = 'none';
		return ui;
	}

	createCoin(position, layer = 2) {
		this.addObject(new CORE.GameObject({
			name: 'coin',
			isStatic: true,
			position: position,
			components: [
				new CORE.SpriteRenderer({
					sprite: new CORE.Sprite(CORE.Game.resources.getTexture('coin')),
					layer,
				}),
				new CORE.CircleCollider(0.5),
			],
		}));
	}

	createExtraLife(position, layer = 2) {
		this.addObject(new CORE.GameObject({
			name: 'extraLife',
			isStatic: true,
			scale: new CORE.Vector2d(0.3, 0.3),
			position: position,
			components: [
				new CORE.SpriteRenderer({
					sprite: new CORE.Sprite(CORE.Game.resources.getTexture('extraLife')),
					layer, 
				}),
				new CORE.CircleCollider(4.64 / 2),
			],
		}));
	}
	
	createCheckPoint(position, layer = 2) {
		this.addObject(new CORE.GameObject({
			name: 'checkPoint',
			isStatic: true,
			scale: new CORE.Vector2d(0.5, 0.5),
			position: position,
			components: [
				new CORE.SpriteRenderer({
					sprite: CORE.Game.resources.getTiles('tileset').get('checkPoint'),
					layer,
				}),
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
				new CORE.SpriteRenderer({
					sprite: CORE.Game.resources.getTiles('tileset').get('turrel'),
					layer: 2,
				}),
				new CORE.BoxCollider(4, 3.4),
				new CORE.RigidBody({
					material: new CORE.Material(1, 0),
				}),
				new MECH.Turrel(position, rotation, speed, timer),
			],
		}));
	}

	createTrampoline(position, layer = 2) {
		this.addObject(new CORE.GameObject({
			name: 'trampoline',
			isStatic: true,
			scale: new CORE.Vector2d(0.3, 0.3),
			position: position,
			components: [
				new CORE.SpriteRenderer({
					sprite: new CORE.Sprite(CORE.Game.resources.getTexture('trampoline')), 
					layer,
				}),
				new CORE.BoxCollider(5.14, 2.02),
				new CORE.RigidBody({
					material: new CORE.Material(1, 1),
				}),
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
				new CORE.SpriteRenderer({
					sprite: new CORE.Sprite(CORE.Game.resources.getTexture('rail')),
					layer: 2,
				}),
			],
		}));
		const min = -0.42;
		const max = 0.42;
		const left = a.transform.transformPoint(new CORE.Vector2d(min, -0.05));
		const right = a.transform.transformPoint(new CORE.Vector2d(max, -0.05));
		let spawn = null;
		if (isRandom) {
			spawn = a.transform.transformPoint(new CORE.Vector2d(min + Math.random() * (max - min), -0.05));
		} else {
			spawn = a.transform.transformPoint(new CORE.Vector2d(0, -0.05));
		}
		this.addObject(new CORE.GameObject({
			name: 'spike',
			scale: new CORE.Vector2d(2, 2),
			rotation: rotation,
			position: spawn,
			components: [
				new CORE.SpriteRenderer({
					sprite: new CORE.Sprite(CORE.Game.resources.getTexture('spike')),
					layer: 2,
				}),
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
					new CORE.SpriteRenderer({
						sprite: new CORE.Sprite(CORE.Game.resources.getTexture('ball')),
						layer: 3,
					}),
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
				new CORE.SpriteRenderer({
					sprite: new CORE.Sprite(CORE.Game.resources.getTexture('ball')),
					layer: 3,
				}),
				new CORE.CircleCollider(0.5),
				new CORE.RigidBody({
					material: new CORE.Material(0.1, 0.5),
				}),
				new MECH.Rotater(3),
			],
		}));
	}

	createLittleBush(x, y, layer = 0, scaleX = 1, scaleY = 1) {
		this.addObject(new CORE.GameObject({
			name: 'littlebushes',
			position: new CORE.Vector2d(x, y),
			isStatic: true,
			scale: new CORE.Vector2d(scaleX, scaleY),
			components: [
				new CORE.SpriteRenderer({
					layer,
					sprite: CORE.Game.resources.getTiles('tileset').get('littlebush'),
				}),
			],
		}));
	}

	createBush(x, y, layer = 0) {
		this.addObject(new CORE.GameObject({
			name: 'bushes',
			position: new CORE.Vector2d(x, y),
			isStatic: true,
			components: [
				new CORE.SpriteRenderer({
					layer,
					sprite: CORE.Game.resources.getTiles('tileset').get('bush'),
				}),
			],
		}));
	}

	createTree(x, y, layer = -2, scaleX = 1, scaleY = 1) {
		this.addObject(new CORE.GameObject({
			name: 'trees',
			position: new CORE.Vector2d(x, y),
			isStatic: true,
			scale: new CORE.Vector2d(scaleX, scaleY),
			components: [
				new CORE.SpriteRenderer({
					layer,
					sprite: CORE.Game.resources.getTiles('tileset').get('tree'),
				}),
			],
		}));
	}

	createLittleTree(x, y, layer = -2) {
		this.addObject(new CORE.GameObject({
			name: 'littleTrees',
			position: new CORE.Vector2d(x, y),
			isStatic: true,
			components: [
				new CORE.SpriteRenderer({
					layer,
					sprite: CORE.Game.resources.getTiles('tileset').get('littletree'),
				}),
			],
		}));
	}

	createStaticBox(x, y, layer = 1) {
		this.addObject(new CORE.GameObject({
			name: 'staticBox',
			position: new CORE.Vector2d(x, y),
			isStatic: true,
			components: [
				new CORE.SpriteRenderer({
					layer,
					sprite: CORE.Game.resources.getTiles('tileset').get('box2'),
				}),
			],
		}));
	}

	createBox(x, y, layer = 1) {
		this.addObject(new CORE.GameObject({
			name: 'box',
			position: new CORE.Vector2d(x, y),
			components: [
				new CORE.SpriteRenderer({
					layer,
					sprite: CORE.Game.resources.getTiles('tileset').get('box1'),
				}),
				new CORE.BoxCollider(1, 1),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0),
					gravityScale: 5,
				}),
			],
		}));
	}
}
