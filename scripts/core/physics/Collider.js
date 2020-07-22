import GameComponent from '../GameComponent.js';

export default class Collider extends GameComponent {
	/**
	 * @type {Collider[]}
	 */
	static colliders = [];
	/**
	 * @type {Collider[]}
	 */
	static dynamicColliders = [];

	constructor() {
		super();
		if (new.target === Collider) {
			throw new TypeError('cannot create instance of abstract class.');
		}
		/**
		 * @type {Collider[]}
		 */
		this.collidersInContact = [];
	}

	allowMultipleComponents() {
		return false;
	}

	onInitialize() {
		Collider.colliders.push(this);
		if (!this.transform.isStatic) {
			Collider.dynamicColliders.push(this);
		}
	}

	onDestroy() {
		let index = Collider.colliders.indexOf(this);
		Collider.colliders.splice(index, 1);
		if (!this.transform.isStatic) {
			index = Collider.dynamicColliders.indexOf(this);
			Collider.dynamicColliders.splice(index, 1);
		}
	}
}
