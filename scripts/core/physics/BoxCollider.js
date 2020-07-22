import Collider from './Collider.js';

export default class BoxCollider extends Collider {
	/**
	 * @param {number} width  Ширина прямоугольного коллайдера.
	 * @param {number} height Высота прямоугольного коллайдера.
	 */
	constructor(width, height) {
		super();
		if (typeof width !== 'number') {
			throw new TypeError('invalid parameter "width". Expected a number.');
		}
		if (typeof height !== 'number') {
			throw new TypeError('invalid parameter "height". Expected a number.');
		}
		if (width <= 0) {
			throw new Error('parameter "width" must be a positive number.');
		}
		if (height <= 0) {
			throw new Error('parameter "height" must be a positive number.');
		}
		/**
		 * @type {number}
		 */
		this.halfWidth = width / 2;
		/**
		 * @type {number}
		 */
		this.halfHeight = height / 2;
	}
}
