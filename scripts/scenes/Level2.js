import * as CORE from '../core/Core.js';
import GameScene from './GameScene.js';
import Level3 from './Level3.js';

export default class Level2 extends GameScene {
	onStart() {
        const ss = this.resources.getTiles('tileset');
		this.hero = this.createHero(new CORE.Vector2d(-93, -0.5), 3, -5);
		this.createSounds();
		this.addObject(new CORE.GameObject({
			name: 'platform',
			isStatic: true,
			components: [
				new CORE.TileMap({
					spriteSheets: [ss],
					map: [
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2',  '2', null, null, null, '2', null, null, null, '2', null, null, null, '2', null, null, null, '2', null, null, null, '2', null, null, null, '2', '2', '2', '2', '2', '2', '2', '2', null, null, null],
                    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '00'],
                    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,'2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '00'],
                    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,'00'],
                    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2', '2'],
                    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '00'],
                    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '00'],
                    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '00'],
					[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, '00'],
					['2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '00', null, null, null, null, null, null,  null, null, null, null, null, null, null, null, null, null, null, null, '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', ],
					[null, null, null, null]
				    ],
				}),
				new CORE.RigidBody({
					material: new CORE.Material(0.5, 0),
				}),
				new CORE.TileMapCollider()
			]
		}))
		
		this.addObject(this.hero);
        this.createRailSpike(3, new CORE.Vector2d(-89, -3.2), 4);
        this.createRailSpike(3, new CORE.Vector2d(-81, -3.2), 4);
        this.createRailSpike(3, new CORE.Vector2d(-74.5, -3.2), 4);
        this.createCoin(new CORE.Vector2d(-60, 2));
        this.createLadder(new CORE.Vector2d(-44, -0.1), 9);
        this.createRailSpike(3.5, new CORE.Vector2d(-31, -3.2), 4);
        this.createCoin(new CORE.Vector2d(-29, -3));
        this.createRailSpike(3, new CORE.Vector2d(-26.5, -3.2), 5);
        this.createExtraLife(new CORE.Vector2d(0, -2.5));
        this.createCheckPoint(new CORE.Vector2d(4, -3.5));
        this.createRailSpike(3, new CORE.Vector2d(11, -3.2), 5);
        this.createRailSpike(3, new CORE.Vector2d(11, 0.1), 5, Math.PI);
        this.createCoin(new CORE.Vector2d(14, -3));
        this.createRailSpike(2.5, new CORE.Vector2d(14.2, -1.5), 4, 3 * Math.PI / 2);
        this.createLadder(new CORE.Vector2d(16, -0.1), 9);
        this.createRailSpike(3, new CORE.Vector2d(29, -3.2), 5);
        this.createCoin(new CORE.Vector2d(31, -3));
        this.createRailSpike(3, new CORE.Vector2d(31, -3.2), 10);
        this.createRailSpike(3, new CORE.Vector2d(33, -3.2), 7);
        this.createLadder(new CORE.Vector2d(53, -0.1), 9);
        this.createTurrel(new CORE.Vector2d(62, 1.5), Math.PI / 2, 5, 2);
        this.createTurrel(new CORE.Vector2d(66, 1.5), Math.PI / 2, 5, 2);
        this.createTurrel(new CORE.Vector2d(70, 1.5), Math.PI / 2, 5, 2);
        this.createTurrel(new CORE.Vector2d(74, 1.5), Math.PI / 2, 5, 2);
        this.createTurrel(new CORE.Vector2d(78, 1.5), Math.PI / 2, 5, 2);
        this.createTurrel(new CORE.Vector2d(82, 1.5), Math.PI / 2, 5, 2);
        this.createCoin(new CORE.Vector2d(87, 6));
        this.createDoor(new CORE.Vector2d(89, 6.5), Level3, this.hero);
        this.createCamera(this.hero, -0.5);
		this.createUI(this.hero);
	}
}
