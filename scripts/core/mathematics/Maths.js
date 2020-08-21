export default class Maths {
	constructor() {
		throw new TypeError('cannot create instance of static class.');
	}

	/**
	 * Ограничивает value в пределах min и max.
	 * 
	 * @param {number} value 
	 * @param {number} min 
	 * @param {number} max
	 * 
	 * @return {number} 
	 */
	static clamp(value, min, max) {
		if (typeof value !== 'number') {
			throw new TypeError('invalid parameter "value". Expected a number.');
		}
		if (typeof min !== 'number') {
			throw new TypeError('invalid parameter "min". Expected a number.');
		}
		if (typeof max !== 'number') {
			throw new TypeError('invalid parameter "max". Expected a number.');
		}
		if (min > max) {
			throw new Error('parameter "min" must not be greater than parameter "max".');
		}
		return value < min ? min : (value > max ? max : value);
	}

	/**
	 * @param {number} angle
	 * 
	 * @return {number} Возвращает угол, переведенный в радианы.
	 */
	static toRadians(angle) {
		if (typeof angle !== 'number') {
			throw new TypeError('invalid parameter "angle". Expected a number.');
		}
		return angle * Math.PI / 180;
	}

	/**
	 * @param {number} angle
	 * 
	 * @return {number} Возвращает угол, переведенный в градусы. 
	 */
	static toDegrees(angle) {
		if (typeof angle !== 'number') {
			throw new TypeError('invalid parameter "angle". Expected a number.');
		}
		return angle * 180 / Math.PI;
	}

	/**
	 * Сравнивает с погрешностью два числа.
	 * 
	 * @param {number} number 
	 * @param {number} otherNumber 
	 * @param {number} epsilon     Точность сравнения.
	 * 
	 * @return {boolean} 
	 */
	static approximatelyEquals(number, otherNumber, epsilon = 0.001) {
		if (typeof number !== 'number') {
			throw new TypeError('invalid parameter "number". Expected a number.');
		}
		if (typeof otherNumber !== 'number') {
			throw new TypeError('invalid parameter "otherNumber". Expected a number.');
		}
		if (typeof epsilon !== 'number') {
			throw new TypeError('invalid parameter "epsilon". Expected a number.');
		}
		return Math.abs(number - otherNumber) <= epsilon;
	}

	static convexHull(points) {
		if (!Array.isArray(points)) {
			throw new TypeError('invalid parameter "points". Expected an array of instances of Vector2d class.');
		}
		for (let i = 0; i < points.length; i++) {
			if (!(points[i] instanceof Vector2d)) {
				throw new TypeError('invalid element of "points". Expected an instance of Vector2d class.');
			}
		}
		if (points.length <= 1) {
			return points;
		}
		const less = (firstPoint, secondPoint) => {
			if (firstPoint.x < secondPoint.x || firstPoint.x === secondPoint.x && firstPoint.y < secondPoint.y) {
				return -1;
			}
			if (firstPoint.equals(secondPoint)) {
				return 0;
			}
			return 1;
		};
		points.sort(less);
		const min = points[0];
		const max = points[points.length - 1];
		const minToMax = max.subtract(min);
		const up = [min];
		const down = [min];
		for (let i = 1; i < points.length; i++) {
			if (i === points.length - 1 || Vector2d.orientation(points[i].subtract(min), minToMax) === -1) {
				while (
					up.length >= 2
					&& Vector2d.orientation(
						up[up.length - 1].subtract(up[up.length - 2]),
						points[i].subtract(up[up.length - 2]),
					) !== -1
				) {
					up.pop();
				}
				up.push(points[i]);
			}
			if (i === points.length - 1 || Vector2d.orientation(points[i].subtract(min), minToMax) === 1) {
				while (
					down.length >= 2
					&& Vector2d.orientation(
						down[down.length - 1].subtract(down[down.length - 2]), 
						points[i].subtract(down[down.length - 2]),
					) !== 1
				) {
					down.pop();
				}
				down.push(points[i]);
			}
		}
		while (points.length > 0) {
			points.pop();
		}
		for (let i = 0; i < up.length; i++) {
			points.push(up[i]);
		}
		for (let i = down.length - 2; i > 0; i--) {
			points.push(down[i]);
		}
	}
}
