import * as CORE from '../core/Core.js';
import GameScene from './GameScene.js';
import Level2 from './Level2.js';

export default class Level1 extends GameScene {
	onStart() {
		this.createRailSpike(5, new CORE.Vector2d(15.4, -0.1), 4)
		this.createRailSpike(3, new CORE.Vector2d(20.4, -0.1), 5)
		const ss = CORE.Game.resources.getTiles('tileset');
		this.hero = this.createHero(new CORE.Vector2d(-30, -0.7), 3);
		this.createBush(-40, -1);
		this.createBush(-40, 4.5, -1);
		this.createLittleBush(-38, 4, 8);
		this.createLittleTree(-37.5, 5.5);
		this.createLittleBush(-37, 4, -1);
		this.createLittleBush(-36, 3.5, -1);
		this.createBush(-34, -0.5);
		this.createLittleBush(-32, -1, 3);
		this.createTree(-32.8, 1.5);
		this.createBush(-23, -0.5);
		this.createBush(-23, 4.5)
		this.createLittleBush(-22.2, -1.1, 1, 0.8, 0.8);
		this.createTree(-21, 6, 2);
		this.createLittleBush(-20.5, 4, 2);
		this.createStaticBox(-20.2, 1);
		this.createBush(-18, 1.2);
		this.createLittleBush(-11, 2, 0, 1.25);
		this.createLittleBush(-5.2, -0.25, 2, 0.5,0.5);
		this.createTree(-5, 1.22, -2, 0.75, 0.75);
		this.createTree(11.5, 2);
		this.createTree(14.2, 1.5, 0, 0.75, 0.9);
		this.createTree(19, 1.75, -3, 0.8, 0.6);
		for (let i =0; i < 13; i += 3) {
			this.createBush(10.5 + i, 0.5);
		}
		for (let i = 0; i < 13; i += 3) {
			this.createLittleBush(9.5 + i, -0.1, 2);
		}
		for (let i = 0; i< 13; i += 5) {
			this.createLittleTree(11 + i, 1.5);
		}
		this.addObject(new CORE.GameObject({
			name: 'platform',
			isStatic: true,
			components: [
				new CORE.TileMap({
					spriteSheets: [ss],
					map: [
						['1', '2', '2', '2', '2', '2', '2', '3', null, null, null, null, null, null, null, null, null, null, '1', '2', '2', '2', '2', '2', '3'],
						['01', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
						['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '1', '2', '3'],
						['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '1', '2', '2', '2', '2', '3'],
						['00', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '1', '2', '2', '2', '2', '2', '2', '2', '2', '3', null, null, null, null, null, '1', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '3'],
						['2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '3', null, null, null, '1', '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', null, null, null, null, null, '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01', '01'  ],
						[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '01', '01', '01', '01' ]
					],
				}),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0),
				}),
				new CORE.TileMapCollider()
			]
		}))
		this.addObject(new CORE.GameObject({
			name: 'background',
			isStatic: true,
			position: new CORE.Vector2d(-19, 0),
			components: [
				new CORE.TileMap({
					spriteSheets: [ss],
					layer: -1,
					map: [
						['01', '01', '01', '01', '01', '01', '01'],
						['00', '00', '00', '00', '00', '00', '00'],
						['00', '00', '00', '00'],
						['00', '00', '00', '01', '01', '01', '01', '01', '01'],
						['00', '00', '00', '00', '00', '00', '00', '00', '00'],
					],
				}),
			]
		}));
		this.createLadder(new CORE.Vector2d(-23, 0), 5);
		this.addObject(this.hero);
		this.createRailSpike(5, new CORE.Vector2d(15.4, -0.1), 4);
		this.createRailSpike(3, new CORE.Vector2d(20.4, -0.1), 5);
		this.createRailSpike(3.5, new CORE.Vector2d(-38, -1.2), 4);
		this.createRailSpike(2, new CORE.Vector2d(-41, 0.5), 4, Math.PI / 2);
		this.createRailSpike(3.5, new CORE.Vector2d(-38, 2), 4, Math.PI);
		this.createExtraLife(new CORE.Vector2d(-5, 0.5));
		this.createCheckPoint(new CORE.Vector2d(-3, 0.5));
		this.createCoin(new CORE.Vector2d(-40.6, -0.8), -3);
		this.createCoin(new CORE.Vector2d(-18.6, 4.7));
		this.createCoin(new CORE.Vector2d(-11, 4));
		this.createCoin(new CORE.Vector2d(20.4, 0.7));
		this.createCoin(new CORE.Vector2d(15.9, 0.7));
		this.createBall(new CORE.Vector2d(-38.6, 4.4));
		this.createBox(0.4, 0.7);
		this.createBox(-1.6, 0.7);
		this.createBox(2.4, 0.7);
		this.createDoor(new CORE.Vector2d(28, 0.7), Level2, this.hero);
		this.createCamera(this.hero, 1.5);
		this.createUI(this.hero, -6);
		this.addObject(this.finish);
	}
}
