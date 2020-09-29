import * as CORE from '../core/Core.js';
import * as MEFB from '../mechanics/For Bonus/MechsForBonus.js';
import * as MECH from '../mechanics/Mechanics.js';

export default class Bonus extends CORE.Scene {
	onInitialize() {
		this.resources.addTextureInLoadQueue('ball', 'resources/ball.png');
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

	createBall(p1, p2, pStart, ballStart, maxPoints) {
		const ball = new CORE.GameObject({
			name: 'ball',
			position: ballStart,
			components: [
				new CORE.SpriteRenderer({
					sprite: new CORE.Sprite(this.resources.getTexture('ball')),
					layer: 3,
				}),
				new CORE.CircleCollider(0.5),
				new CORE.RigidBody({
					material: new CORE.Material(0.1, 0.8),
					gravityScale: 1,
				}),
				new MEFB.Rotater(3),
				new MEFB.Volleyball(p1, p2, pStart, ballStart, maxPoints),
			],
		})
		this.addObject(ball);
		return ball;
	}

	createCamera() {
		const size = new CORE.Vector2d(document.body.clientWidth, document.body.clientHeight);
		const camera = new CORE.Camera({
			name: 'camera',
			width: size.x,
			height: size.y,
			zoom: 5,
			position: new CORE.Vector2d(-1, 0),
			clearColor: new CORE.Color(156, 180, 219),
			components: [
				new MECH.Resizer(),
			]
		});
		this.addObject(camera);
		return camera;
	}

	onStart() {
		const ss = this.resources.getTiles('tileset');
		this.hero1 = new CORE.GameObject({
			name: 'hero1',
			scale: new CORE.Vector2d(0.8, 0.8),
			position: new CORE.Vector2d(-5, 0),
			components: [
				new CORE.SpriteRenderer({
					sprite: ss.get('hero'),
					layer: 2,
				}),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0.3),
					gravityScale: 3,
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
				new MEFB.Controller1(),
			],
		});
		this.hero2 = new CORE.GameObject({
			name: 'hero2',
			scale: new CORE.Vector2d(0.8, 0.8),
			position: new CORE.Vector2d(3, 0),
			components: [
				new CORE.SpriteRenderer({
					sprite: ss.get('hero'),
					layer: 2,
				}),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0.3),
					gravityScale: 3,
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
				new MEFB.Controller2(),
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
					playOnInitialize: true,
				}),
				new CORE.AudioPlayer({
					volume: 0.5,
					loop: true,
					playbackRate: 1,
					sound: this.resources.getSound('theme'),
					isSpatialSound: false,
					playOnInitialize: true,
				})
			],
		}));
		this.addObject(new CORE.GameObject({
			name: 'platform',
			isStatic: true,
			components: [
				new CORE.TileMap({
					spriteSheets: [ss],
					map: [
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					['1', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '3'],
					['1', null, null, null, null, null, null, null, null, null, null, null, null, null, '3'],
					['1', null, null, null, null, null, null, null, null, null, null, null, null, null, '3'],
					['1', null, null, null, null, null, null, null, null, null, null, null, null, null, '3'],
					['1', null, null, null, null, null, null, null, null, null, null, null, null, null, '3'],
					['1', null, null, null, null, null, null, '01', null, null, null, null, null, null, '3'],
					['1', null, null, null, null, null, null, '00', null, null, null, null, null, null, '3'],
					['1', null, null, null, null, null, null, '00', null, null, null, null, null, null, '3'],
					['1', null, null, null, null, null, null, '00', null, null, null, null, null, null, '3'],
					['1', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '3'],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					],
				}),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0.3),
				}),
				new CORE.TileMapCollider()
			]
		}))
		this.addObject(this.hero1);
		this.addObject(this.hero2);
		this.createCamera();
		this.ball = this.createBall(this.hero1, this.hero2, new CORE.Vector2d(-5, 0), new CORE.Vector2d(-4, 3), 7);
		this.addObject(new CORE.UIObject ({
			id: 'score',
			tag: 'h1',
			components: [
				new MEFB.UICounter(this.ball),
			]
		}));
	}
}
