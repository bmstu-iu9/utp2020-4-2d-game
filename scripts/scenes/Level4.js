import * as CORE from '../core/Core.js';
import GameScene from './GameScene.js';
import Level5 from './Level5.js';

export default class Level4 extends GameScene {
	onStart() {
		const ss = CORE.Game.resources.getTiles('tileset');
		this.hero = this.createHero(new CORE.Vector2d(-42, 0), 4);
		this.createSounds();
		this.addObject(new CORE.GameObject({
			name: 'platform',
			isStatic: true,
			components: [
				new CORE.TileMap({
					spriteSheets: [ss],
					map: [
					[null, null],
					['1', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', null, null],
					['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					['2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', null, null, '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2'],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
					
					],
				}),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0),
				}),
				new CORE.TileMapCollider()
			]
		}))
		
		this.addObject(this.hero);
		this.createRailSpike(1.6, new CORE.Vector2d(-37, -1.2), 5);
		this.createRailSpike(2, new CORE.Vector2d(-37, 1.2), 5, Math.PI);
		this.createRailSpike(1.5, new CORE.Vector2d(-31, -1.2), 7);
		this.createRailSpike(2, new CORE.Vector2d(-31, 1.2), 7, Math.PI);
		this.createRailSpike(1.5, new CORE.Vector2d(-25.5, -1.2), 4);
		this.createRailSpike(1.8, new CORE.Vector2d(-24, 1.2), 7, Math.PI);
		this.createRailSpike(1.7, new CORE.Vector2d(-20.5, -1.2), 6);
		this.createRailSpike(2.2, new CORE.Vector2d(-18, 1.2), 5, Math.PI);
		this.createRailSpike(2.2, new CORE.Vector2d(-13.5, -1.2), 8);
		this.createRailSpike(0.9, new CORE.Vector2d(-14, 1.2), 3, Math.PI);
		this.createRailSpike(1.8, new CORE.Vector2d(-7, -1.2), 5);
		this.createRailSpike(1.4, new CORE.Vector2d(-10.5, 1.2), 4, Math.PI);
		this.createRailSpike(1.9, new CORE.Vector2d(-1.5, -1.2), 6);
		this.createRailSpike(1.2, new CORE.Vector2d(-6, 1.2), 5, Math.PI);
		this.createRailSpike(1.3, new CORE.Vector2d(3.5, -1.2), 4);
		this.createRailSpike(2.7, new CORE.Vector2d(1, 1.2), 9, Math.PI);
		this.createRailSpike(2.6, new CORE.Vector2d(9, -1.2), 7);
		this.createRailSpike(2.4, new CORE.Vector2d(8.5, 1.2), 6, Math.PI);
		this.createRailSpike(1.22, new CORE.Vector2d(14.5, -1.2), 4);
		this.createRailSpike(1.4, new CORE.Vector2d(15.5, 1.2), 8, Math.PI);
		this.createRailSpike(1.5, new CORE.Vector2d(19, -1.2), 5);
		this.createRailSpike(2.1, new CORE.Vector2d(22, 1.2), 5, Math.PI);
		this.createRailSpike(1.9, new CORE.Vector2d(24.5, -1.2), 6);
		this.createRailSpike(1.2, new CORE.Vector2d(26, 1.2), 3, Math.PI);
		this.createCoin(new CORE.Vector2d(31, -0.5));
		this.createCoin(new CORE.Vector2d(33, -0.5));
		this.createCoin(new CORE.Vector2d(35, -0.5));
		this.createCoin(new CORE.Vector2d(37, -0.5));
		this.createCoin(new CORE.Vector2d(39, -0.5));
		this.createDoor(new CORE.Vector2d(42, -0.3), Level5, this.hero);
		this.createCamera(this.hero, 0.5);
		this.createUI(this.hero, -6);
	}
}
