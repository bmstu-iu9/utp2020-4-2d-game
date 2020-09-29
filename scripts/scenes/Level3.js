import * as CORE from '../core/Core.js';
import GameScene from './GameScene.js';
import Level4 from './Level4.js';

export default class Level3 extends GameScene {
	onStart() {
		const ss = CORE.Game.resources.getTiles('tileset');
		this.hero = this.createHero(new CORE.Vector2d(-99, 6), 3);
		this.createSounds();
		this.addObject(new CORE.GameObject({
			name: 'platform',
			isStatic: true,
			components: [
				new CORE.TileMap({
					spriteSheets: [ss],
					map: [
					[null, null],
					['1', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', null,, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2','2', '2', '2', '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,  null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,'2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', null, null, '2', '2', '2', '2', null, null, '2', '2', '2', '2', null, null, '2', '2', '2', '2', null, null, '2', '2', '2', '2', null, null, '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', null, null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,null, null, null, null, '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2',null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,null, null, null, null, '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2', null, null],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '00', '00', '00', '00', '00', '00', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
					],
				}),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0),
				}),
				new CORE.TileMapCollider()
			]
		}))
		
		this.addObject(this.hero);
		this.createRailSpike(3, new CORE.Vector2d(-90, 4.8), 5);
		this.createRailSpike(3, new CORE.Vector2d(-84, 4.8), 4);
		this.createRailSpike(3, new CORE.Vector2d(-76, 4.8), 5);
		this.createRailSpike(4, new CORE.Vector2d(-73, 4.8), 7);
		this.createRailSpike(2.7, new CORE.Vector2d(-70, 4.8), 5);
		this.createCoin(new CORE.Vector2d(-73, 5));
		this.createCheckPoint(new CORE.Vector2d(-63, 5.25));
		this.createLadder(new CORE.Vector2d(-60, -0.5), 9);
		this.createTurrel(new CORE.Vector2d(-48.5, -4), Math.PI / 2, 3.5, 2);
		this.createTurrel(new CORE.Vector2d(-43.5, -4), Math.PI / 2, 3.5, 2);
		this.createTurrel(new CORE.Vector2d(-38.5, -4), Math.PI / 2, 3.5, 2);
		this.createCoin(new CORE.Vector2d(-32, 2));
		this.createTurrel(new CORE.Vector2d(-33.5, -4), Math.PI / 2, 3.5, 2);
		this.createTurrel(new CORE.Vector2d(-28.5, -4), Math.PI / 2, 3.5, 2);
		this.createTurrel(new CORE.Vector2d(-23.5, -3), Math.PI / 2, 3.5, 2);
		this.createTurrel(new CORE.Vector2d(-18.5, -2), Math.PI / 2, 3.5, 2);
		this.createLadder(new CORE.Vector2d(-5, -1), 9);
		this.createExtraLife(new CORE.Vector2d(-1.5, -3.6));
		this.createRailSpike(3, new CORE.Vector2d(3, -4.2), 4);
		this.createRailSpike(2.7, new CORE.Vector2d(7.5, -4.2), 5);
		this.createCoin(new CORE.Vector2d(4, -4));
		this.createRailSpike(3.2, new CORE.Vector2d(12, -4.2), 4);
		this.createTurrel(new CORE.Vector2d(16.9, -3), 0, 3, 4);
		this.createCoin(new CORE.Vector2d(25, 2));
		this.createCheckPoint(new CORE.Vector2d(27, 2.25));
		this.createLadder(new CORE.Vector2d(45, -0), 9);
		this.createTurrel(new CORE.Vector2d(51.5, -5), Math.PI / 2, 4, 3);
		this.createExtraLife(new CORE.Vector2d(54, -0.1));
		this.createRailSpike(2.5, new CORE.Vector2d(54.5, -1.2), 4);
		this.createTurrel(new CORE.Vector2d(57.5, -5), Math.PI / 2, 5, 3);
		this.createRailSpike(2.8, new CORE.Vector2d(60.5, -1.2), 4);
		this.createTurrel(new CORE.Vector2d(63.5, -5), Math.PI / 2, 5, 3);
		this.createRailSpike(3.2, new CORE.Vector2d(66.5, -1.2), 4);
		this.createTurrel(new CORE.Vector2d(69.5, -5), Math.PI / 2, 5, 3);
		this.createRailSpike(3, new CORE.Vector2d(72.5, -1.2), 4);
		this.createTurrel(new CORE.Vector2d(75.5, -5), Math.PI / 2, 5, 3);
		this.createRailSpike(3, new CORE.Vector2d(78.5, -1.2), 4);
		this.createTurrel(new CORE.Vector2d(81.5, -5), Math.PI / 2, 5, 3);
		this.createCoin(new CORE.Vector2d(87, -1));
		this.createDoor(new CORE.Vector2d(92, -0.5), Level4, this.hero);
		this.createCamera(this.hero, -1.5);
		this.createUI(this.hero, -8);
	}
}
