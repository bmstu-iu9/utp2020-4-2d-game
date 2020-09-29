import * as CORE from '../core/Core.js';
import * as MECH from '../mechanics/Mechanics.js';

export default class GameScene extends CORE.Scene {
    onInitialize() {
		this.resources.addTextureInLoadQueue('ball', 'resources/ball.png');
		this.resources.addTextureInLoadQueue('coin', 'resources/coin.png');
		this.resources.addTextureInLoadQueue('checkPoint', 'resources/checkPoint.png');
		this.resources.addTextureInLoadQueue('extraLife', 'resources/extraLife.png');
		this.resources.addTextureInLoadQueue('spike', 'resources/spike.png');
		this.resources.addTextureInLoadQueue('laser', 'resources/laser.png');
		this.resources.addTextureInLoadQueue('turrel', 'resources/turrel.png');
		this.resources.addTextureInLoadQueue('trampoline', 'resources/trampoline.png');
		this.resources.addTextureInLoadQueue('rail', 'resources/rail.png');
		this.resources.addTextureInLoadQueue('hero', 'resources/hero.png');
		this.resources.addSoundInLoadQueue('nature', 'resources/nature.mp3');
		this.resources.addSoundInLoadQueue('theme', 'resources/theme.mp3');
		this.resources.addTextInLoadQueue('description', 'resources/html_fragments/description.html');
		this.resources.createTileMapSpriteSheet({
			id: 'tileset',
			path: 'resources/map.png',
			pixelsPerUnit: 16,
			tiles: [
				['3', new CORE.Rect(16, 48, 16, 16)],
				['1', new CORE.Rect(32, 48, 16, 16)],
				['2', new CORE.Rect(48, 48, 16, 16)],
				['01', new CORE.Rect(16, 64, 16, 16)],
				['00', new CORE.Rect(64, 64, 16, 16)],
				['ladder', new CORE.Rect(64, 48, 16, 16)],
				['littlebush', new CORE.Rect(0, 32, 32, 16)],
				['bush', new CORE.Rect(32, 16, 48, 32)],
				['littletree', new CORE.Rect(80, 0, 64, 80)],
				['tree', new CORE.Rect(144, 0, 70, 80)],
				['hero', new CORE.Rect(0, 80, 16, 32)],
				['walk', new CORE.Rect(16, 80, 16, 32)],
				['walk1', new CORE.Rect(32, 80, 16, 32)],
				['walk2', new CORE.Rect(48, 80, 16, 32)],
				['walk3', new CORE.Rect(64, 80, 16, 32)],
				['walk4', new CORE.Rect(80, 80, 16, 32)],
				['walk5', new CORE.Rect(96, 80, 16, 32)],
				['walk6', new CORE.Rect(112, 80, 16, 32)],
				['box1', new CORE.Rect(0, 48, 16, 16)],
				['box2', new CORE.Rect(0, 64, 16, 16)],
				['finish1', new CORE.Rect(128, 80, 76, 28)],
				['finish2', new CORE.Rect(128, 108, 76, 28)],
			],
		});
	}

    createHero(position, gravityScale, deadline) {
        const ss = this.resources.getTiles('tileset');
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
						new CORE.SpriteKeyFrame(ss.get('walk'), 0.1),
						new CORE.SpriteKeyFrame(ss.get('walk1'), 0.2),
						new CORE.SpriteKeyFrame(ss.get('walk2'), 0.3),
						new CORE.SpriteKeyFrame(ss.get('walk3'), 0.4),
						new CORE.SpriteKeyFrame(ss.get('walk4'), 0.5),
						new CORE.SpriteKeyFrame(ss.get('walk5'), 0.6),
						new CORE.SpriteKeyFrame(ss.get('walk6'), 0.7),
						
					])],
					['idle', new CORE.Animation(1, false, [
						new CORE.SpriteKeyFrame(ss.get('hero'), 0),
					])],
				], 'idle'),
				new CORE.BoxCollider(0.8, 2),
				new MECH.Controller(deadline),
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
                    sound: this.resources.getSound('nature'),
                    isSpatialSound: false,
                    playOnInitialize: true
                }),
                new CORE.AudioPlayer({
                    volume: 0.025,
                    loop: true,
                    playbackRate: 1,
                    sound: this.resources.getSound('theme'),
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
							spriteSheets: [this.resources.getTiles('tileset')],
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
        CORE.Screen.setSize(size); 
        const camera = new CORE.Camera({
            name: 'camera',
			width: size.x,
			height: size.y,
			zoom: 4,
			clearColor: new CORE.Color(156, 180, 219),
			components: [
				new MECH.Follower(hero, floor),
			],
        });
        this.addObject(camera);
        return camera;
    }

    createDoor(position, nextLevel, hero) {
        const ss = this.resources.getTiles('tileset');
        const door = new CORE.GameObject({
			name: 'door',
			position,
			scale: new CORE.Vector2d(0.4, 0.4),
			components: [
				new CORE.SpriteRenderer({
                    sprite: new CORE.Sprite(this.resources.getTexture('extraLife')),
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

    createUI(hero) {
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
			innerHTML: this.resources.getText('description'),
		});
		const audio = new CORE.UIObject({
			tag: 'div',
			id: 'audio',
			children: [
				new CORE.UIObject({
					tag: 'div',
					id: 'audioText',
					innerText: 'Громкость звука:',
				}),
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
							id: 'liAbout',
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
							id: 'liAudio',
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
							id: 'liClose',
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
        return ui;
    }

	createCoin(position, layer = 2) {
		this.addObject(new CORE.GameObject({
			name: 'coin',
			isStatic: true,
			position: position,
			components: [
				new CORE.SpriteRenderer({
					sprite: new CORE.Sprite(this.resources.getTexture('coin')),
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
					sprite: new CORE.Sprite(this.resources.getTexture('extraLife')),
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
					sprite: new CORE.Sprite(this.resources.getTexture('checkPoint')),
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
					sprite: new CORE.Sprite(this.resources.getTexture('turrel')),
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
					sprite: new CORE.Sprite(this.resources.getTexture('trampoline')), 
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
					sprite: new CORE.Sprite(this.resources.getTexture('rail')),
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
					sprite: new CORE.Sprite(this.resources.getTexture('spike')),
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
						sprite: new CORE.Sprite(this.resources.getTexture('ball')),
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
					sprite: new CORE.Sprite(this.resources.getTexture('ball')),
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
					sprite: this.resources.getTiles('tileset').get('littlebush'),
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
					sprite: this.resources.getTiles('tileset').get('bush'),
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
					sprite: this.resources.getTiles('tileset').get('tree'),
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
					sprite: this.resources.getTiles('tileset').get('littletree'),
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
					sprite: this.resources.getTiles('tileset').get('box2'),
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
					sprite: this.resources.getTiles('tileset').get('box1'),
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