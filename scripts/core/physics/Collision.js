import Vector2d from '../Vector2d.js';
import BoxCollider from './BoxCollider.js';
import CircleCollider from './CircleCollider.js';
import Collider from './Collider.js';
import RigidBody from './RigidBody.js';

const sign = x => x > 0 ? 1 : -1;

/**
 * @param {CircleCollider} firstCircle 
 * @param {CircleCollider} secondCircle 
 */
const circleVsCircle = (circleA, circleB) => {
	const ab = circleB.transform.position.subtract(circleA.transform.position);
	const radiiSum = circleA.radius + circleB.radius;
	let distanse = ab.squaredLength();
	if (distanse >= radiiSum * radiiSum) {
		return null;
	}
	distanse = Math.sqrt(distanse);
	const normal = distanse != 0 ? ab.multiply(1 / distanse) : Vector2d.up;
	const depth = radiiSum - distanse;
	return {normal, depth};
};

/**
 * @param {CircleCollider} circle
 * @param {BoxCollider} box
 */
const circleVsBox = (circle, box) => {
	const ab = box.transform.position.subtract(circle.transform.position);
	const clamp = (x, a, b) => x < a ? a : (x > b ? b : x);
	let closestPoint = new Vector2d(
		clamp(ab.x, -box.halfWidth, box.halfWidth),
		clamp(ab.y, -box.halfHeight, box.halfHeight),
	);
	if (closestPoint.equals(ab)) {
		let normal = Vector2d.zero;
		if (box.halfWidth - Math.abs(ab.x) < box.halfHeight - Math.abs(ab.y)) {
			const xSign = sign(ab.x);
			normal = new Vector2d(xSign, 0);
			closestPoint = new Vector2d(xSign * box.halfWidth, ab.y);
		} else {
			const ySign = sign(ab.y);
			normal = new Vector2d(0, ySign);
			closestPoint = new Vector2d(ab.x, ySign * box.halfHeight);
		}
		const depth = circle.radius - closestPoint.subtract(ab).length();
		return {normal, depth};
	}
	let normal = ab.subtract(closestPoint);
	const distanse = normal.length();
	if (distanse >= circle.radius) {
		return null;
	}
	normal = normal.multiply(1 / distanse);
	const depth = circle.radius - distanse;
	return {normal, depth};
};

/**
 * @param {BoxCollider} boxA
 * @param {BoxCollider} boxB
 */
const boxVsBox = (boxA, boxB) => {
	const ab = boxB.transform.position.subtract(boxA.transform.position);
	const xOverlap = boxA.halfWidth + boxB.halfWidth - Math.abs(ab.x);
	const yOverlap = boxA.halfHeight + boxB.halfHeight - Math.abs(ab.y);
	if (xOverlap <= 0 || yOverlap <= 0) {
		return null;
	}
	const xSign = sign(ab.x);
	const ySign = sign(ab.y);
	const normal = xOverlap < yOverlap ? Vector2d.right.multiply(xSign) : Vector2d.up.multiply(ySign);
	const depth = xOverlap < yOverlap ? xOverlap : yOverlap;
	return {normal, depth};
};

/**
 * 
 * @param {BoxCollider} box
 * @param {CircleCollider} circle 
 */
const boxVsCircle = (box, circle) => {
	const info = circleVsBox(circle, box);
	if (info == null) {
		return null;
	}
	info.normal = info.normal.opposite();
	return info;
};

const getId = (collider) => {
	if (collider instanceof CircleCollider) {
		return 0;
	}
	return 1;
}

const dispatch = [
	[circleVsCircle, circleVsBox],
	[boxVsCircle, boxVsBox],
];

const notify = (firstCollider, secondCollider, firstRigidBody, secondRigidBody, message) => {
	if (firstRigidBody != null && secondRigidBody != null) {
		if (firstRigidBody.gameObject != firstCollider.gameObject) {
			firstCollider.gameObject.callInComponents('onCollision' + message, secondCollider);
		}
		firstRigidBody.gameObject.callInComponents('onCollision' + message, secondCollider);
		if (secondRigidBody.gameObject != secondCollider.gameObject) {
			secondCollider.gameObject.callInComponents('onCollision' + message, firstCollider);
		}
		secondRigidBody.gameObject.callInComponents('onCollision' + message, firstCollider);
	} else if (firstRigidBody != null) {
		if (firstRigidBody.gameObject != firstCollider.gameObject) {
			firstCollider.gameObject.callInComponents('onTrigger' + message, secondCollider);
		}
		firstRigidBody.gameObject.callInComponents('onTrigger' + message, secondCollider);
		secondCollider.gameObject.callInComponents('onTrigger' + message, firstCollider);
	} else if (secondRigidBody != null) {
		firstCollider.gameObject.callInComponents('onTrigger' + message, secondCollider);
		if (secondRigidBody.gameObject != secondCollider.gameObject) {
			secondCollider.gameObject.callInComponents('onTrigger' + message, firstCollider);
		}
		secondRigidBody.gameObject.callInComponents('onTrigger' + message, firstCollider);
	}
}

export default class Collision {
	/**
	 * Данный конструктор не имеет смысла - для информации о коллизии двух коллайдеров
	 * необходимо использовать статический метод "ofColliders" данного класса.
	 *
	 * @access private
	 */
	constructor() {
		/**
		 * @type {Collider}
		 */
		this.firstCollider = null;
		/**
		 * @type {RigidBody}
		 */
		this.firstRigidBody = null;
		/**
		 * @type {Collider}
		 */
		this.secondCollider = null;
		/**
		 * @type {RigidBody}
		 */
		this.secondRigidBody = null;
		/**
		 * @type {Vector2d}
		 */
		this.normal = null;
		/**
		 * @type {number}
		 */
		this.depth = null;
	}

	/**
	 * Узнает информацию о коллизии двух коллайдеров.
	 *
	 * @param {Collider} firstCollider
	 * @param {Collider} secondCollider
	 *
	 * @return {Collision} Возвращает информацию о коллизии или null (в случае, если коллизии нет).
	 */
	static ofColliders(firstCollider, secondCollider) {
		if (!(firstCollider instanceof Collider)) {
			throw new TypeError('invalid parameter "firstCollider". Expected an instance of Collider class.');
		}
		if (!(secondCollider instanceof Collider)) {
			throw new TypeError('invalid parameter "secondCollider". Expected an instance of Collider class.');
		}
		const info = dispatch[getId(firstCollider)][getId(secondCollider)](firstCollider, secondCollider);
		const firstRigidBody = firstCollider.getRigidBody();
		const secondRigidBody = secondCollider.getRigidBody();
		if (info == null) {
			if (firstCollider.collidersInContact.has(secondCollider)) {
				notify(firstCollider, secondCollider, firstRigidBody, secondRigidBody, 'Exit');
				firstCollider.collidersInContact.delete(secondCollider);
				secondCollider.collidersInContact.delete(firstCollider);
			}
			return null;
		}
		if (!firstCollider.collidersInContact.has(secondCollider)) {
			notify(firstCollider, secondCollider, firstRigidBody, secondRigidBody, 'Enter');
			firstCollider.collidersInContact.add(secondCollider);
			secondCollider.collidersInContact.add(firstCollider);
		}
		if (firstRigidBody == null || secondRigidBody == null) {
			return null;
		}
		if (
			(firstRigidBody.transform.isStatic || firstRigidBody.isKinematic)
			&& (secondRigidBody.transform.isStatic || secondRigidBody.isKinematic)
		) {
			return null;
		}
		const collision = new Collision();
		collision.firstCollider = firstCollider;
		collision.firstRigidBody = firstRigidBody;
		collision.secondCollider = secondCollider;
		collision.secondRigidBody = secondRigidBody;
		collision.normal = info.normal;
		collision.depth = info.depth;
		return collision;
	}

	applyImpulse() {
		const relativeVelocity = this.secondRigidBody.velocity.subtract(this.firstRigidBody.velocity);
		const relativeVelocityAlongNormal = relativeVelocity.dot(this.normal);
		if (relativeVelocityAlongNormal >= 0) {
			return;
		}
		const overallRestitution = Math.min(
			this.firstRigidBody.material.restitution, 
			this.secondRigidBody.material.restitution,
		);
		let impulseAlongNormal = -(1 + overallRestitution) * relativeVelocityAlongNormal;
		impulseAlongNormal /= this.firstRigidBody.invMass + this.secondRigidBody.invMass;
		if (impulseAlongNormal <= 0.025) {
			return;
		}
		const impulse = this.normal.multiply(impulseAlongNormal);
		this.firstRigidBody.velocity = this.firstRigidBody.velocity.subtract(
			impulse.multiply(this.firstRigidBody.invMass),
		);
		this.secondRigidBody.velocity = this.secondRigidBody.velocity.add(
			impulse.multiply(this.secondRigidBody.invMass),
		);
	}

	positionalCorrection() {
		const kSlop = 0.0008;
		const percent = 0.2;
		const correction = this.normal.multiply(
			Math.max(this.depth - kSlop, 0) / (this.firstRigidBody.invMass + this.secondRigidBody.invMass) * percent,
		);
		if (!this.firstRigidBody.transform.isStatic && !this.firstRigidBody.isKinematic) {
			this.firstRigidBody.transform.setPosition(
				this.firstRigidBody.transform.position.subtract(correction.multiply(this.firstRigidBody.invMass)),
			);
		}
		if (!this.secondRigidBody.transform.isStatic && !this.secondRigidBody.isKinematic) {
			this.secondRigidBody.transform.setPosition(
				this.secondRigidBody.transform.position.add(correction.multiply(this.secondRigidBody.invMass)),
			);
		}
	}
}
