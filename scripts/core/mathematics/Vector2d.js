export default class Vector2d {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		if (typeof x !== 'number') {
			throw new TypeError('invalid parameter "x". Expected a number.');
		}
		if (typeof y !== 'number') {
			throw new TypeError('invalid parameter "y". Expected a number.');
		}
		this.x = x;
		this.y = y;
	}

	/**
	 * Добавляет к данному вектору передаваемый вектор.
	 *
	 * @param {Vector2d} vector
	 *
	 * @return {Vector2d} Возвращает сумму векторов.
	 */
	add(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return new Vector2d(this.x + vector.x, this.y + vector.y);
	}

	/**
	 * @return {Vector2d} Возвращает противоположный вектор данному.
	 */
	opposite() {
		return new Vector2d(-this.x, -this.y);
	}

	/**
	 * Вычитает из данного вектора передаваемый вектор.
	 *
	 * @param {Vector2d} vector
	 *
	 * @return {Vector2d} Возвращает разность векторов.
	 */
	subtract(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return new Vector2d(this.x - vector.x, this.y - vector.y);
	}

	/**
	 * @param {number} scalar
	 *
	 * @return {Vector2d} Возвращает произведение данного вектора на число.
	 */
	multiply(scalar) {
		if (typeof scalar !== 'number') {
			throw new TypeError('invalid parameter "scalar". Expected a number.');
		}
		return new Vector2d(this.x * scalar, this.y * scalar);
	}

	/**
	 * @param {number} scalar
	 * 
	 * @return {Vector2d} Возвращает произведение данного вектора на число, обратное передаваемому.
	 */
	divide(scalar) {
		if (typeof scalar !== 'number') {
			throw new TypeError('invalid parameter "scalar". Expected a number.');
		}
		if (scalar === 0) {
			throw new Error('cannot divide by zero.');
		}
		return new Vector2d(this.x / scalar, this.y / scalar);
	}

	/**
	 * @return {number} Возвращает длину данного вектора в квадрате.
	 */
	squaredLength() {
		return this.x * this.x + this.y * this.y;
	}

	/**
	 * @return {number} Возвращает длину данного вектора.
	 */
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	/**
	 * @return {Vector2d} Возвращает вектор, получаемый нормированием данного.
	 */
	normalize() {
		const length = this.length();
		return new Vector2d(this.x / length, this.y / length);
	}

	/**
	 * @return {Vector2d} Возвращает вектор, ортогональный данному.
	 */
	orthogonalVector() {
		return new Vector2d(this.y, -this.x);
	}

	/**
	 * Вычисляет ортогональную составляющую передаваемого вектора на подпространство, задаваемое данным вектором.
	 * 
	 * @param {Vector2d} vector
	 * 
	 * @return {Vector2d}
	 */
	orthogonalComponent(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		const multiplier = (vector.x * this.x + vector.y * this.y) / (this.x * this.x + this.y * this.y);
		return new Vector2d(vector.x - multiplier * this.x, vector.y - multiplier * this.y);
	}

	/**
	 * Вычисляет скалярное произведение данного вектора с передаваемым.
	 *
	 * @param {Vector2d} vector
	 *
	 * @return {number}
	 */
	dot(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return this.x * vector.x + this.y * vector.y;
	}

	/**
	 * Вычисляет проекцию на ось Oz векторного произведения данного вектора с передаваемым.
	 *
	 * @param {Vector2d} vector
	 * 
	 * @return {number} 
	 */
	cross(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return this.x * vector.y - this.y * vector.x;
	}

	/**
	 * Определяет ориентацию векторов на плоскости.
	 * 
	 * -1 соответствует отрицательной ориентации,
	 * 0 соответствует случаю коллинеарности,
	 * 1 соответствует положительной ориентации.
	 * 
	 * @param {Vector2d} firstVector 
	 * @param {Vector2d} secondVector
	 * 
	 * @return {number} 
	 */
	static orientation(firstVector, secondVector) {
		if (!(firstVector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "firstVector". Expected an instance of Vector2d class.');
		}
		if (!(secondVector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "secondVector". Expected an instance of Vector2d class.');
		}
		return Math.sign(firstVector.x * secondVector.y - firstVector.y * secondVector.x);
	}

	/**
	 * Вычисляет скалярную проекцию данного вектора на передаваемый.
	 *
	 * @param {Vector2d} vector
	 *
	 * @return {number}
	 */
	scalarProjectTo(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return (vector.x * this.x + vector.y * this.y) / Math.sqrt(vector.x * vector.x + vector.y * vector.y);
	}

	/**
	 * Вычисляет векторную проекцию данного вектора на передаваемый.
	 *
	 * @param {Vector2d} vector
	 *
	 * @return {Vector2d}
	 */
	vectorProjectTo(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		const multiplier = (vector.x * this.x + vector.y * this.y) / (vector.x * vector.x + vector.y * vector.y);
		return new Vector2d(vector.x * multiplier, vector.y * multiplier);
	}

	/**
	 * Возвращает вектор, полученный при повороте данного на угол (в радианах).
	 *
	 * Положительный угол - поворот против часовой, отрицательный - по часовой.
	 *
	 * @param {number} angle
	 *
	 * @return {Vector2d}
	 */
	rotate(angle) {
		if (typeof angle !== 'number') {
			throw new TypeError('invalid parameter "angle". Expected a number.');
		}
		const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
		const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
		return new Vector2d(x, y);
	}

	/**
	 * Сравнивает данный вектор с передаваемым.
	 *
	 * @param {Vector2d} vector
	 *
	 * @return {boolean} Возвращает true, если векторы равны, иначе - false.
	 */
	equals(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return this.x === vector.x && this.y === vector.y;
	}

	/**
	 * Сравнивает с погрешностью данный вектор с передаваемым.
	 * 
	 * @param {Vector2d} vector 
	 * @param {number}   epsilon Точность сравнения. 
	 * 
	 * @return {boolean}
	 */
	approximatelyEquals(vector, epsilon = 0.001) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		if (typeof epsilon !== 'number') {
			throw new TypeError('invalid parameter "epsilon". Expected a number.');
		}
		return Math.abs(this.x - vector.x) <= epsilon && Math.abs(this.y - vector.y) <= epsilon;
	}

	/**
	 * Vector (0, 0)
	 */
	static zero = new Vector2d(0, 0);

	/**
	 * Vector (0, 1)
	 */
	static up = new Vector2d(0, 1);

	/**
	 * Vector (0, -1)
	 */
	static down = new Vector2d(0, -1);

	/**
	 * Vector (1, 0)
	 */
	static right = new Vector2d(1, 0);

	/**
	 * Vector (-1, 0)
	 */
	static left = new Vector2d(-1, 0);
}
