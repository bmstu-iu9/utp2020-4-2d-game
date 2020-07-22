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
}
