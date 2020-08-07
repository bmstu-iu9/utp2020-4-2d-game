import Collider from './Collider.js';

export default class CircleCollider extends Collider {
	/**
	 * @param {number} radius 
	 */
	constructor(radius) {
		super();
		if (typeof radius !== 'number') {
			throw new TypeError('invalid parameter "radius". Expected a number.');
		}
		if (radius <= 0) {
			throw new Error('parameter "radius" must be a positive number.');
		}
		/**
		 * @type {number}
		 */
		this.radius = radius;
	}

	onEnable() {
		super.onEnable();
		if (Math.abs(this.transform.scale.x) !== Math.abs(this.transform.scale.y)) {
			throw new Error('scale.x must be equal scale.y.');
		}
		this.radius *= Math.abs(this.scale.x);
		this.area = Math.PI * this.radius * this.radius;
	}

	onRecalculate() {
		if (Math.abs(this.transform.scale.x) !== Math.abs(this.transform.scale.y)) {
			throw new Error('scale.x must be equal scale.y.');
		}
		this.radius = this.radius / Math.abs(this.scale.x) * Math.abs(this.transform.scale.x);
		this.area = Math.PI * this.radius * this.radius;
	}
}
