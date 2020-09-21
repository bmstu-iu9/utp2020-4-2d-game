import Collider from './Collider.js';
import Matrix2x2 from '../../mathematics/Matrix2x2.js';
import Matrix3x3 from '../../mathematics/Matrix3x3.js';
import Vector2d from '../../mathematics/Vector2d.js';

export default class EllipseCollider extends Collider {
	/**
	 * @param {number} a
	 * @param {number} b
	 */
	constructor(a, b) {
		if (typeof a !== 'number') {
			throw new TypeError('invalid parameter "a". Expected a number.');
		}
		if (typeof b !== 'number') {
			throw new TypeError('invalid parameter "b". Expected a number.');
		}
		super();
		this.localA = Math.abs(a);
		this.localB = Math.abs(b);
	}

	supportPoint(direction) {
		const localDirection = this.invRotationMatrix.multiplyByVector(direction);
		const denominator = Math.sqrt((localDirection.x * this.globalA) ** 2 + (localDirection.y * this.globalB) ** 2);
		const localSupportPoint = new Vector2d(
			localDirection.x * this.globalA ** 2 / denominator,
			localDirection.y * this.globalB ** 2 / denominator,
		);
		return this.motionMatrix.multiplyByVector(localSupportPoint);
	}

	calculateArea() {
		return Math.PI * this.globalA * this.globalB;
	}

	calculateInertia(mass) {
		return 1 / 5 * mass * (this.globalA ** 2 + this.globalB ** 2);
	}

	recalculate() {
		this.invRotationMatrix = Matrix2x2.ofRotation(this.transform.rotation).transpose();
		this.motionMatrix = Matrix3x3.ofTranslation(this.transform.position.x, this.transform.position.y)
			.multiply(Matrix3x3.ofRotation(this.transform.rotation));
		const transformedA = this.transform.transformPoint(new Vector2d(this.localA, 0));
		this.globalA = transformedA.subtract(this.transform.position).length();
		const transformedB = this.transform.transformPoint(new Vector2d(0, this.localB));
		this.globalB = transformedB.subtract(this.transform.position).length();
	}
}
