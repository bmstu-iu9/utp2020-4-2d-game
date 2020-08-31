import * as CORE from '../core/Core.js';
import * as MEFB from '../mechanics/For Bonus/MechsForBonus.js';

export default class bonus extends CORE.Scene {
	onInitialize() {
		this.resources.addImageInLoadQueue('graphic', 'resources/graphic.png');
		this.resources.addImageInLoadQueue('ball', 'resources/ball.png');
		this.resources.addImageInLoadQueue('hero', 'resources/hero.png');
		this.resources.addSoundInLoadQueue('nature', 'resources/nature.mp3');
		this.resources.addSoundInLoadQueue('theme', 'resources/theme.mp3');
		this.resources.addTextInLoadQueue('description', 'resources/html_fragments/description.html');
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
				new CORE.SpriteRenderer(new CORE.Sprite(this.resources.getImage('ball')), 3),
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
			['ladders', new CORE.Rect(64, 0, 16, 16)],
		)
		const ssh = new CORE.SpriteSheet(
			this.resources.getImage('hero'),
			['walk', new CORE.Rect(0, 0, 16, 32)],
			['walk1', new CORE.Rect(16, 0, 16, 32)],
			['walk2', new CORE.Rect(32, 0, 16, 32)],
			['walk3', new CORE.Rect(48, 0, 16, 32)],
		)
		this.hero1 = new CORE.GameObject({
			name: 'hero1',
			scale: new CORE.Vector2d(4, 4),
			position: new CORE.Vector2d(-2, -1),
			components: [
				new CORE.SpriteRenderer(ssh.get('walk')),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0.3),
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
				new MEFB.Controller1(),
			],
		});
		this.hero2 = new CORE.GameObject({
			name: 'hero2',
			scale: new CORE.Vector2d(4, 4),
			position: new CORE.Vector2d(6, -1),
			components: [
				new CORE.SpriteRenderer(ssh.get('walk')),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0.3),
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
			scale: new CORE.Vector2d(1, 1),
			position: new CORE.Vector2d(2, 0),
			isStatic: true,
			components: [
				new CORE.TileMap(16, 16, ss, [
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
				]),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0.5),
				}),
				new CORE.TileMapCollider(),
			]
		}))
		this.addObject(new CORE.Camera({
			name: 'camera',
			position: new CORE.Vector2d(2, -1),
			scale: new CORE.Vector2d(0.9, 0.9),
			clearColor: new CORE.Color(156, 180, 219),
		}));
		this.addObject(this.hero1);
		this.addObject(this.hero2);
		this.ball = this.createBall(this.hero1, this.hero2, new CORE.Vector2d(-2, -1), new CORE.Vector2d(-1, 3), 7);
		this.addObject(new CORE.UIObject ({
			id: 'score',
			tag: 'h1',
			components: [
				new MEFB.UICounter(this.ball),
			]
		}));
	}
}
