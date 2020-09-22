import Vector2d from '../../mathematics/Vector2d.js';
import Collider from '../colliders/Collider.js';
import CSOPoint from './CSOPoint.js';
import Maths from '../../mathematics/Maths.js';

export default class Simplex {
	/**
	 * @param {Collider} colliderA
	 * @param {Collider} colliderB
	 */
	constructor(colliderA, colliderB) {
		let direction = colliderB.transform.position.subtract(colliderA.transform.position);
		if (direction.equals(Vector2d.zero)) {
			direction = Vector2d.up;
		}
		this.pA = new CSOPoint(colliderA, colliderB, direction);
		this.pB = new CSOPoint(colliderA, colliderB, direction.opposite());
		const vAB = this.pB.subtract(this.pA);
		direction = vAB.orthogonalComponent(this.pA.opposite());
		if (direction.approximatelyEquals(Vector2d.zero, 1e-10)) {
			direction = vAB.orthogonalVector();
			this.pC = new CSOPoint(colliderA, colliderB, direction);
			const vCA = this.pA.subtract(this.pC);
			const vCB = this.pB.subtract(this.pC);
			if (Maths.approximatelyEquals(vCA.x * vCB.y, vCB.x * vCA.y, 1e-10)) {
				this.pC = new CSOPoint(colliderA, colliderB, direction.opposite());
			}
		} else {
			this.pC = new CSOPoint(colliderA, colliderB, direction);
		}
	}

	/**
	 * @param {CSOPoint}
	 */
	add(csoPoint) {
		this.pC = csoPoint;
	}

	/**
	 * @return {Vector2d}
	 */
	computeDirection() {
		const vCA = this.pA.subtract(this.pC);
		const vCB = this.pB.subtract(this.pC);
		const vCO = this.pC.opposite();
		const vNca = vCA.orthogonalComponent(vCO);
		const vNcb = vCB.orthogonalComponent(vCO);
		const vHca = vCA.orthogonalComponent(vCB);
		const vHcb = vCB.orthogonalComponent(vCA);
		if (vNca.dot(vHca) < 0) {
			this.pointB = this.pointC;
			return vNca;
		}
		if (vNcb.dot(vHcb) < 0) {
			this.pointA = this.pointC;
			return vNcb;
		}
		return Vector2d.zero;
	}
}
