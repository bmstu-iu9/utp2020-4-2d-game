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
	 * @return {Vector2d} Возвращает сумму векторов (создается новый вектор).
	 */
	add(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return new Vector2d(this.x + vector.x, this.y + vector.y);
	}

	/**
	 * Вычитает из данного вектора передаваемый вектор.
	 * 
	 * @param {Vector2d} vector
	 * 
	 * @return {Vector2d} Возвращает разность векторов (создается новый вектор).
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
	 * @return {Vector2d} Возвращает произведение данного вектора на число (создается новый вектор).
	 */
	multiply(scalar) {
		if (typeof scalar !== 'number') {
			throw new TypeError('invalid parameter "scalar". Expected a number.');
		}
		return new Vector2d(this.x * scalar, this.y * scalar);
	}

	/**
	 * @return {Vector2d} Возвращает длину данного вектора в квадрате. 
	 */
	squaredLength() {
		return this.x * this.x + this.y * this.y;
	}

	/**
	 * @return {Vector2d} Возвращает длину данного вектора. 
	 */
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	/**
	 * @return {Vector2d} Возвращает вектор, получаемый нормированием данного (создается новый вектор). 
	 */
	normalize() {
		const length = this.length();
		return new Vector2d(this.x / length, this.y / length);
	}

	/**
	 * @return {Vector2d} Возвращает вектор, ортогональный данному (создается новый вектор). 
	 */
	orthogonalVector() {
		return new Vector2d(this.y, -this.x);
	}

	/**
	 * Вычисляет скалярное произведение данного вектора с передаваемым. 
	 * 
	 * @param {Vector2d} vector
	 *
	 * @return {number} Возвращает скалярное произведение векторов.
	 */
	dot(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return this.x * vector.x + this.y * vector.y;
	}

	/**
	 * Вычисляет векторное произведение на плоскости данного вектора с передаваемым.
	 * 
	 * Это аналог вектороного произведения в пространстве: вычисляется проекция векторного произведения векторов,
	 * находящихся в плоскости Oxy, на ось Oz. 
	 * 
	 * @param {Vector2d} vector
	 *
	 * @return {number} Возвращает векторное произведение векторов на плоскости.
	 */
	cross(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return firstVector.x * secondVector.y - secondVector.x * firstVector.y;
	}

	/**
	 * Определяет ориентацию упрорядоченной пары векторов.
	 * 
	 * @param {Vector2d} firstVector
	 * @param {Vector2d} secondVector
	 *
	 * @return {number} Возвращает число, соответствующее ориентации векторов (-1 - отрицательно ориентированные, 0 - коллинеарны, 1 - положительно ориентированные).
	 */
	static orientation(firstVector, secondVector) {
		if (!(firstVector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "firstVector". Expected an instance of Vector2d class.');
		}
		if (!(secondVector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "secondVector". Expected an instance of Vector2d class.');
		}
		return Math.sign(firstVector.cross(secondVector));
	}

	/**
	 * Вычисляет векторную проекцию данного вектора на передаваемый.
	 * 
	 * @param {Vector2d} vector
	 *
	 * @return {Vector2d} Возвращает векторную проекцию (создается новый вектор).
	 */
	vectorProjectTo(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return vector.multiply(vector.scalarMultiply(this) / vector.scalarMultiply(vector));
	}

	/**
	 * Вычисляет скалярную проекцию данного вектора на передаваемый.
	 * 
	 * @param {Vector2d} vector
	 *
	 * @return {number} Возвращает скалярную проекцию.
	 */
	scalarProjectTo(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return vector.scalarMultiply(this) / vector.length();
	}

	/**
	 * Поворачивает данный вектор на угол (в радианах).
	 * 
	 * Положительный угол - поворот против часовой, отрицательный - по часовой.
	 * 
	 * @param {number} angle
	 *
	 * @return {Vector2d} Возвращает вектор, полученный при повороте данного (создается новый вектор).
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
	 * @return {Vector2d} Возвращает копию данного вектора (создается новый вектор).
	 */
	copy() {
		return new Vector2d(this.x, this.y);
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
