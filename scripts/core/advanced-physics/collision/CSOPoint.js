import Collider from '../colliders/Collider.js';
import Vector2d from '../../mathematics/Vector2d.js';

export default class CSOPoint extends Vector2d {
	/**
	 * @param {Collider} colliderA
	 * @param {Collider} colliderB
	 * @param {Vector2d} direction
	 */
	constructor(colliderA, colliderB, direction) {
		const supportPointA = colliderA.supportPoint(direction);
		const supportPointB = colliderB.supportPoint(direction.opposite());
		super(supportPointA.x - supportPointB.x, supportPointA.y - supportPointB.y);
		this.supportPointA = supportPointA;
		this.supportPointB = supportPointB;
	}
}
