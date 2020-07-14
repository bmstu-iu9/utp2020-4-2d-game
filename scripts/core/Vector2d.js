export default class Vector2d {
	/**
 	 * @param {Number} x
	 * @param {Number} y
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
	 * Умножает вектор на скаляр (число).
	 * 
 	 * @param {Number} scalar
	 * 
	 * @return {Vector2d} Возвращает произведение вектора на скаляр (создается новый вектор).
  	 */
	multiply(scalar) {
		if (typeof scalar !== 'number') {
			throw new TypeError('invalid parameter "scalar". Expected a number.');
		}
		return new Vector2d(this.x * scalar, this.y * scalar);
	}

	/**
	 * Вычисляет длину вектора в квадрате (необходимо для оптимизации).
	 * 
	 * @return {Vector2d} Возвращает длину вектора в квадрате. 
  	 */
	squaredLength() {
		return this.x * this.x + this.y * this.y;
	}

	/**
	 * Вычисляет длину вектора.
	 * 
	 * @return {Vector2d} Возвращает длину вектора. 
  	 */
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	/**
	 * Нормирует данный вектор.
	 * 
	 * @return {Vector2d} Возвращает нормированный вектор (создается новый вектор). 
  	 */
	normalize() {
		const length = this.length();
		return new Vector2d(this.x / length, this.y / length);
	}

	/**
	 * Вычисляет вектор, ортогональный данному.
	 * 
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
	 * @return {Number} Возвращает скалярное произведение векторов.
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
	 * @return {Number} Возвращает векторное произведение векторов на плоскости.
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
	 * @return {Number} Возвращает число, соответствующее ориентации векторов (-1 - отрицательно ориентированные, 0 - коллинеарны, 1 - положительно ориентированные).
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
	 * @return {Number} Возвращает скалярную проекцию.
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
 	 * @param {Number} angle
	 *
	 * @return {Vector2d} Возвращает вектор, полученный поворотом данного (создается новый вектор).
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
	 * Копирует данный вектор.
	 *
	 * @return {Vector2d} Возвращает копию данного вектора (создается новый вектор).
 	 */
	copy() {
		return new Vector2d(this.x, this.y);
	}

	static zero = new Vector2d(0, 0);
	static up = new Vector2d(0, 1);
	static down = new Vector2d(0, -1);
	static right = new Vector2d(1, 0);
	static left = new Vector2d(-1, 0);
}