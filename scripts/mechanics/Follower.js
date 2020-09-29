import CameraComponent from '../core/graphics/CameraComponent.js';
import Vector2d from '../core/mathematics/Vector2d.js';

export default class Follower extends CameraComponent {
	constructor(target, floor) {
		super();
		this.target = target;
		this.floor = floor;
		this.isLookDown = false;
	}
	
	setFloor(y) {
		this.floor = y;
	}

	onUpdate() {
		let position = this.target.transform.position;
		position = new Vector2d(position.x, position.y + 1.2);
		if (this.isLookDown) {
			position = position.subtract(new Vector2d(0, 2));
		}
		if (position.y < this.floor) {
			position = new Vector2d(position.x, this.floor);
		}
		this.transform.setPosition(position);
	}
}