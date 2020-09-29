import * as CORE from '../core/Core.js';
import GameScene from './GameScene.js';
import HardLevel1 from './HardLevel1.js';

export default class Level5 extends GameScene {
	onStart() {
		const ss = this.resources.getTiles('tileset');
		this.hero = this.createHero(new CORE.Vector2d(-66, -0.7), 3, -6);
		this.createSounds();

		
		this.addObject(new CORE.GameObject({
			name: 'platform',
			isStatic: true,
			components: [
				new CORE.TileMap({
					spriteSheets: [ss],
					map: [
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2'],
                    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2'],
					['1', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2'],
					['01', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', null, '2', '2', '2', null, '2', '2', '2', null, '2', '2', '2', null, '2', '2', '2', null, '2', '2', '2', '2', '2', '2'],
					['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', null, null, '2', null, null, '2', null, null, '2', null, null],
					['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
					['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '01', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2'],
					['2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2', '2', '2', '2'],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
				    ],
				}),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0),
				}),
				new CORE.TileMapCollider()
			]
		}))
		

		this.addObject(this.hero);
        this.createRailSpike(3, new CORE.Vector2d(-57.5, 1), 18, Math.PI);
        this.createTurrel(new CORE.Vector2d(-48, -1), 0, 2, 4);
        this.createTurrel(new CORE.Vector2d(-48, -2), 0, 3, 3);
        this.createCoin(new CORE.Vector2d(-47, 0.2));
        this.createTrampoline(new CORE.Vector2d(-42, -0.8));
        this.createCheckPoint(new CORE.Vector2d(-30, 3.5));
        this.createLadder(new CORE.Vector2d(-26, -0.2), 7);
		this.createExtraLife(new CORE.Vector2d(-24, -1.2));
        this.createRailSpike(2.5, new CORE.Vector2d(-17, -2.2), 5);
        this.createRailSpike(3, new CORE.Vector2d(-11.5, -2.2), 6);
        this.createCoin(new CORE.Vector2d(-9, -1.4));
        this.createRailSpike(3, new CORE.Vector2d(-6.5, -2.2), 4);
        this.createTurrel(new CORE.Vector2d(-2, -1), 0, 4, 4);
        this.createTurrel(new CORE.Vector2d(0, -2), Math.PI / 2, 4, 1.5);
        this.createTurrel(new CORE.Vector2d(3.5, -2), Math.PI / 2, 4, 1.5);
        this.createTurrel(new CORE.Vector2d(6.5, -2), Math.PI / 2, 4, 1.5);
        this.createCoin(new CORE.Vector2d(8, 1.1));
        this.createTurrel(new CORE.Vector2d(9.5, -2), Math.PI / 2, 4, 1.5);
        this.createCheckPoint(new CORE.Vector2d(11, 0.5));
        this.createTurrel(new CORE.Vector2d(12.5, -2), Math.PI / 2, 4, 1.5);
        this.createRailSpike(2, new CORE.Vector2d(15.5, 2.8), 4);
        this.createRailSpike(2.5, new CORE.Vector2d(19.5, 3.8), 4);
        this.createCoin(new CORE.Vector2d(20, 4.1));
        this.createRailSpike(2.7, new CORE.Vector2d(23.5, 4.8), 4);
        this.createLadder(new CORE.Vector2d(26, -0.1), 7);
		this.createExtraLife(new CORE.Vector2d(29, -1.4));
        this.createTrampoline(new CORE.Vector2d(36, -2.9));
        this.createRailSpike(1.55, new CORE.Vector2d(42, 1.8), 3);
        this.createTurrel(new CORE.Vector2d(44, -1), Math.PI / 2, 4, 2);
        this.createRailSpike(1.5, new CORE.Vector2d(46, 1.8), 3);
        this.createTurrel(new CORE.Vector2d(48, -1), Math.PI / 2, 4, 2);
        this.createRailSpike(1.6, new CORE.Vector2d(50, 1.8), 3);
        this.createTurrel(new CORE.Vector2d(52, -1), Math.PI / 2, 4, 2);
        this.createRailSpike(1.55, new CORE.Vector2d(54, 1.8), 3);
        this.createTurrel(new CORE.Vector2d(56, -1), Math.PI / 2, 4, 2);
        this.createRailSpike(1.5, new CORE.Vector2d(58, 1.8), 3);
		this.createTurrel(new CORE.Vector2d(60, -1), Math.PI / 2, 4, 2);
        this.createCoin(new CORE.Vector2d(62, 2.1));
		this.createDoor(new CORE.Vector2d(65, 2.3), HardLevel1, this.hero);
		this.createCamera(this.hero, 0.5);
		this.createUI(this.hero);
	}
}
