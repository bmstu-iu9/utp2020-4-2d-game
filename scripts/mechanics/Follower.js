import CameraComponent from '../core/graphics/CameraComponent.js';
import Vector2d from '../core/mathematics/Vector2d.js';

export default class Follower extends CameraComponent {
	constructor(target) {
		super();
		this.target = target;
		this.floor = 1.4;
	}
	
	setFloor(y) {
		this.floor = y;
	}

	onUpdate() {
		let position = this.target.transform.position;
		position = new Vector2d(position.x, position.y + 1.2);
		if (position.y < this.floor) {
			position = new Vector2d(position.x, this.floor);
		}
		if (position.x < 0.4) {
			position = new Vector2d(0.4, position.y);
		}
		this.transform.setPosition(position);
	}
}