export default class Rect {
	/**
	 * (x, y) - левая верхняя точка прямоугольника.
	 * 
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(x, y, width, height) {
		if (typeof x !== 'number') {
			throw new TypeError('invalid parameter "x". Expected a number.');
		}
		if (typeof y !== 'number') {
			throw new TypeError('invalid parameter "y". Expected a number.');
		}
		if (typeof width !== 'number') {
			throw new TypeError('invalid parameter "width". Expected a number.');
		}
		if (typeof height !== 'number') {
			throw new TypeError('invalid parameter "height". Expected a number.');
		}
		if (width <= 0) {
			throw new Error('width must be greater than 0'); 
		}
		if (height <= 0) {
			throw new Error('height must be greater than 0'); 
		}
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * 
	 * @return {boolean} Возврщает true, если точка с координатами (x, y) содержится в данном прямоугольнике.
	 */
	contains(x, y) {
		if (typeof x !== 'number') {
			throw new TypeError('invalid parameter "x". Expected a number.');
		}
		if (typeof y !== 'number') {
			throw new TypeError('invalid parameter "y". Expected a number.');
		}
		return x >= this.x && Math.abs(x - this.x) <= this.width && y >= this.y && Math.abs(y - this.y) <= this.height;
	}
}
