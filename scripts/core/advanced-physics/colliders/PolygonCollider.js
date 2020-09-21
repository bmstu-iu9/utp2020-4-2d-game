import Collider from './Collider.js';
import Vector2d from '../../mathematics/Vector2d.js';
import Maths from '../../mathematics/Maths.js';

export default class PolygonCollider extends Collider {
	/**
	 * @param {Vector2d[]} points Массив точек (полигон - их выпуклая оболочка).
	 */
	constructor(points) {
		super();
		if (!Array.isArray(points)) {
			throw new TypeError('invalid parameter "points". Expected an array.');
		}
		this.localVertices = Array.from(points);
		Maths.convexHull(this.localVertices);
		if (this.localVertices.length <= 2) {
			throw new Error('polygon must have one at least 3 vertices which aren\'t on the same line.');
		}
		this.localCentroid = Vector2d.zero;
		this.localVertices.forEach(vertex => {
			this.localCentroid = this.localCentroid.add(vertex);
		});
		this.localCentroid = this.localCentroid.divide(this.localVertices.length);
	}

	supportPoint(direction) {
		let supportPoint = null;
		let maxDot = -Infinity;
		this.globalVertices.forEach(vertex => {
			const dot = vertex.dot(direction);
			if (dot > maxDot) {
				maxDot = dot;
				supportPoint = vertex;
			}
		});
		return supportPoint;
	}

	calculateArea() {
		let prev = this.globalVertices[this.globalVertices.length - 1];
		let curr = this.globalVertices[0];
		let area = prev.x * curr.y - curr.x * prev.y;
		this.globalVertices.forEach(vertex => {
			prev = curr;
			curr = vertex;
			area += prev.x * curr.y - curr.x * prev.y;
		});
		return Math.abs(area) / 2;
	}

	calculateInertia(mass) {
		// TODO
	}

	recalculate() {
		this.globalVertices = this.localVertices.map(vertex => {
			return this.transform.transformPoint(vertex.subtract(this.localCentroid));
		});
	}
}
