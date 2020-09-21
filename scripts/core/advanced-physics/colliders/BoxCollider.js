import PolygonCollider from './PolygonCollider.js';
import Vector2d from '../../mathematics/Vector2d.js';

export default class BoxCollider extends PolygonCollider {
	/**
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(width, height) {
		if (typeof width !== 'number') {
			throw new TypeError('invalid parameter "width". Expected a number.');
		}
		if (width <= 0) {
			throw new Error('parameter "width" must be a positive number.');
		}
		if (typeof height !== 'number') {
			throw new TypeError('invalid parameter "height". Expected a number.');
		}
		if (height <= 0) {
			throw new Error('parameter "height" must be a positive number.');
		}
		const halfWidth = width / 2;
		const halfHeight = height / 2;
		super([
			new Vector2d(halfWidth, halfHeight),
			new Vector2d(-halfWidth, halfHeight),
			new Vector2d(-halfWidth, -halfHeight),
			new Vector2d(halfWidth, -halfHeight),
		]);
	}
}
