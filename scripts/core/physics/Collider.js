import GameComponent from '../GameComponent.js';
import Vector2d from '../Vector2d.js';
import RigidBody from './RigidBody.js';

export default class Collider extends GameComponent {
	/**
	 * @type {Set<Collider>}
	 */
	static colliders = new Set();
	/**
	 * @type {Set<Collider>}
	 */
	static dynamicColliders = new Set();

	constructor() {
		super();
		if (new.target === Collider) {
			throw new TypeError('cannot create instance of abstract class.');
		}
		/**
		 * @type {Set<Collider>}
		 */
		this.collidersInContact = new Set();
		/**
		 * @type {Vector2d}
		 */
		this.scale = null;
		/**
		 * @type {number}
		 */
		this.area = 0;
	}

	allowMultipleComponents() {
		return false;
	}

	getRigidBody() {
		let gameObject = this.gameObject;
		while (gameObject != null) {
			const rigidBody = gameObject.getComponent(RigidBody);
			if (rigidBody != null) {
				return rigidBody;
			}
			gameObject = gameObject.parent;
		}
		return null;
	}

	recalculate() {
		if (this.scale.equals(this.transform.scale)) {
			return;
		}
		this.onRecalculate();
		this.scale = this.transform.scale;
	}

	onRecalculate() {

	}

	onInitialize() {
		this.scale = this.transform.scale;
		Collider.colliders.add(this);
		if (!this.transform.isStatic) {
			Collider.dynamicColliders.add(this);
		}
	}

	onDestroy() {
		Collider.colliders.delete(this);
		Collider.dynamicColliders.delete(this);
	}
}
