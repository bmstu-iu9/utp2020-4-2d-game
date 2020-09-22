import Simplex from './Simplex.js';
import CSOPoint from './CSOPoint.js';

export default class ExtendedPolygon {
	/**
	 * @param {Simplex} simplex 
	 */
	constructor(simplex) {
		this.vertices = [simplex.pA, simplex.pB, simplex.pC];
		this.lastUsedIndex = 0;
	}

	/**
	 * @param {CSOPoint} csoPoint 
	 */
	add(csoPoint) {
		this.vertices.splice(this.lastUsedIndex, 0, csoPoint);
	}

	closestEdge() {
		let direction = null;
		let directionSqrLen = Infinity;
		let edge = null;
		for (let curr = 0; curr < this.vertices.length; curr++) {
			const next = (curr + 1) % this.vertices.length;
			const firstPoint = this.vertices[curr];
			const secondPoint = this.vertices[next];
			const currDirection = secondPoint.subtract(firstPoint).orthogonalComponent(firstPoint);
			const currDirectionSqrLen = currDirection.squaredLength();
			if (currDirectionSqrLen < directionSqrLen) {
				direction = currDirection;
				directionSqrLen = currDirectionSqrLen;
				edge = {firstPoint, secondPoint, direction};
				this.lastUsedIndex = next;  
			}
		}
		return edge;
	}
}
