import GameComponent from '../core/GameComponent.js';
import RigidBody from '../core/physics/RigidBody.js';
import Controller from './Controller.js';

export default class Player extends GameComponent {
	constructor(lifeCount, startPoint) {
		super();
		this.lifeCount = lifeCount;
		this.lastCheckPoint = startPoint;
		this.interactingObject = null;
	}

	increaseLife() {
		this.lifeCount++;
		console.log('lives left: ' + this.lifeCount);
	}

	decreaseLife() {
		this.lifeCount--;
		if (this.lifeCount <= 0) {
			console.log('death');
			this.gameObject.scene.reload();
		} else {
			console.log('lives left: ' + this.lifeCount);
			this.controller.relocate(this.lastCheckPoint);
			this.controller.freeze();
		}
	}

	onInitialize() {
		/**
		 * @type {RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(RigidBody);
		if (this.rigidBody == null) {
			throw new Error('no rigid body.');
		}
		/**
		 * @type {Controller}
		 */
		this.controller = this.gameObject.getComponent(Controller);
		if (this.controller == null) {
			throw new Error('no controller.');
		}
	}

	onCollisionEnter(collider) {
		if (collider.gameObject.name === 'spike' || collider.gameObject.name === 'laser')  {
			this.decreaseLife();
		}
	}

	onTriggerEnter(collider) {
		if (collider.gameObject != null && collider.gameObject.name === 'checkPoint') {
			console.log('New checkpoint');
			this.lastCheckPoint = collider.transform.position;
			collider.gameObject.destroy();
		} else if (collider.gameObject != null && collider.gameObject.name === 'extraLife') {
			this.increaseLife();
			collider.gameObject.destroy();
		}
	}

	onTriggerExit(collider) {
		if (this.interactingObject != null && collider.gameObject === this.interactingObject.gameObject) {
			this.interactingObject = null;
		}
	}
}