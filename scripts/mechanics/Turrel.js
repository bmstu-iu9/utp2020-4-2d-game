import GameComponent from '../core/GameComponent.js';
import GameObject from '../core/GameObject.js';
import Vector2d from '../core/mathematics/Vector2d.js';
import Sprite from '../core/graphics/Sprite.js';
import SpriteRenderer from '../core/graphics/SpriteRenderer.js';
import BoxCollider from '../core/physics/BoxCollider.js';
import RigidBody from '../core/physics/RigidBody.js';
import Material from '../core/physics/Material.js';
import Game from '../core/Game.js';

export default class Turrel extends GameComponent {
	constructor(position, rotation, speed, timer) {
		super();
		this.rotation = rotation;
		this.timer = timer;
		this.maxTime = timer;
		if (rotation == 0) {
			this.laserPosition = new Vector2d(position.x - 1, position.y);
			this.laserVelocity = new Vector2d(-speed, 0);
		} else if (rotation == Math.PI / 2) {
			this.laserPosition = new Vector2d(position.x, position.y + 1);
			this.laserVelocity = new Vector2d(0, speed);
		} else if (rotation == Math.PI) {
			this.laserPosition = new Vector2d(position.x + 1, position.y);
			this.laserVelocity = new Vector2d(speed, 0);
		} else {
			this.laserPosition = new Vector2d(position.x, position.y - 1);
			this.laserVelocity = new Vector2d(0, -speed);
		}
	}

	onFixedUpdate(delta) {
		this.timer -= delta;
		if (this.timer <= 0) {
			if (this.gameObject.scene.containsObject(this.laser)) {
				this.gameObject.scene.removeObject(this.laser);
				this.timer = delta;	
			} else {
				this.laser = new GameObject({
					name: 'laser',
					scale: new Vector2d(0.05, 0.03),
					position: this.laserPosition,
					rotation: this.rotation,
					components: [
						new SpriteRenderer({
							sprite: new Sprite(Game.resources.getTexture('laser')),
							layer: 2,
						}),
						new BoxCollider(1, 1),
						new RigidBody({
							material: new Material(1, 0),
							isKinematic: true,
							velocity: this.laserVelocity,
							gravityScale: 0,
						}),
					],
				});
				this.gameObject.scene.addObject(this.laser);
				this.timer = this.maxTime;
			}	
		}
	}
}