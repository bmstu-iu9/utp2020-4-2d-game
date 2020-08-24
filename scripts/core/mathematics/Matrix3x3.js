import Vector2d from './Vector2d.js';

export default class Matrix3x3 extends Float32Array {
	constructor() {
		super(9);
	}

	/**
	 * @param {number} d00 Элемент в 0 строчке 0 столбца.
	 * @param {number} d10 Элемент в 1 строчке 0 столбца.
	 * @param {number} d20 Элемент во 2 строчке 0 столбца.
	 * @param {number} d01 Элемент в 0 строчке 1 столбца.
	 * @param {number} d11 Элемент в 1 строчке 1 столбца.
	 * @param {number} d21 Элемент во 2 строчке 1 столбца.
	 * @param {number} d02 Элемент в 0 строчке 2 столбца.
	 * @param {number} d12 Элемент в 1 строчке 2 столбца.
	 * @param {number} d22 Элемент во 2 строчке 2 столбца.
	 * 
	 * @return {Matrix3x3} Возвращает матрицу 3x3, созданную из переданных значений.
	 */
	static fromValues(
		d00, d10, d20,
		d01, d11, d21,
		d02, d12, d22,
	) {
		const assert = (x, name) => {
			if (typeof x != 'number') {
				throw new TypeError(`invalid parameter "${name}". Expected a number.`);
			}
			return x;
		}
		const result = new Matrix3x3();
		result[0] = assert(d00, 'd00');
		result[1] = assert(d10, 'd10');
		result[2] = assert(d20, 'd20');
		result[3] = assert(d01, 'd01');
		result[4] = assert(d11, 'd11');
		result[5] = assert(d21, 'd21');
		result[6] = assert(d02, 'd02');
		result[7] = assert(d12, 'd12');
		result[8] = assert(d22, 'd22');
		return result;
	}

	/**
	 * @param {number[]} array Массив, из которого надо создать матрицу 3x3.
	 * 
	 * @return {Matrix3x3} Возвращает матрицу, созданную из массива.
	 */
	static fromArray(array) {
		if (!Array.isArray(array)) {
			throw new TypeError(`invalid parameter "array". Expected an array.`);
		}
		if (array.length != 9) {
			throw new RangeError('invalid parameter "array". Only 3x3 matrix.');
		}
		return Matrix3x3.fromValues(
			array[0], array[1], array[2],
			array[3], array[4], array[5],
			array[6], array[7], array[8],
		);
	}

	/**
	 * @param {number}    x         Координата по x.
	 * @param {number}    y         Координата по y.
	 * @param {Matrix3x3} outMatrix Матрица 3x3, в которую можно записать результат.
	 * 
	 * @return {Matrix3x3} Возвращает матрицу перевода.
	 */
	static ofTranslation(x, y, outMatrix = null) {
		if (outMatrix != null && !(outMatrix instanceof Matrix3x3)) {
			throw new TypeError('invalid parameter "outMatrix". Expected an instance of Matrix3x3 class.');
		}
		if (typeof x != 'number') {
			throw new TypeError('invalid parameter "x". Expected a number.');
		}
		if (typeof y != 'number') {
			throw new TypeError('invalid parameter "y". Expected a number.');
		}
		const result = outMatrix || new Matrix3x3();
		result[0] = 1;
		result[4] = 1;
		result[6] = x;
		result[7] = y;
		result[8] = 1;
		if (outMatrix != null) {
			result[1] = result[2] = result[3] = result[5] = 0;
		}
		return result;
	}

	/**
	 * @param {number}    angle     Угол поворота в радианах.
	 * @param {Matrix3x3} outMatrix Матрица 3x3, в которую можно записать результат.
	 * 
	 * @return {Matrix3x3} Возвращает матрицу поворота.
	 */
	static ofRotation(angle, outMatrix = null) {
		if (outMatrix != null && !(outMatrix instanceof Matrix3x3)) {
			throw new TypeError('invalid parameter "outMatrix". Expected an instance of Matrix3x3 class.');
		}
		if (typeof angle != 'number') {
			throw new TypeError('invalid parameter "angle". Expected a number.');
		}
		const result = outMatrix || new Matrix3x3();
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		result[0] = cos;
		result[1] = sin;
		result[3] = -sin;
		result[4] = cos;
		result[8] = 1;
		if (outMatrix != null) {
			result[2] = result[5] = result[6] = result[7] = 0;
		}
		return result;
	}

	/**
	 * @param {number}    x         Масштаб по x.
	 * @param {number}    y         Масштаб по y.
	 * @param {Matrix3x3} outMatrix Матрица 3x3, в которую можно записать результат.
	 * 
	 * @return {Matrix3x3} Возвращает матрицу масштаба.
	 */
	static ofScaling(x, y, outMatrix = null) {
		if (outMatrix != null && !(outMatrix instanceof Matrix3x3)) {
			throw new TypeError('invalid parameter "outMatrix". Expected an instance of Matrix3x3 class.');
		}
		if (typeof x != 'number') {
			throw new TypeError('invalid parameter "x". Expected a number.');
		}
		if (typeof y != 'number') {
			throw new TypeError('invalid parameter "y". Expected a number.');
		}
		const result = outMatrix || new Matrix3x3();
		result[0] = x;
		result[4] = y;
		result[8] = 1;
		if (outMatrix != null) {
			result[1] = result[2] = result[3] = result[5] = result[6] = result[7] = 0;
		}
		return result;
	}

	/**
	 * @param {Vector2d}  translation Вектор перевода.
	 * @param {number}    angle       Угол поворота в радианах.
	 * @param {Vector2d}  scaling     Масштаб.
	 * @param {Matrix3x3} outMatrix   Матрица 3x3, в которую можно записать результат.
	 * 
	 * @return {Matrix3x3} Возвращает матрицу преобразования.
	 */
	static ofTranslationRotationScaling(translation, angle, scaling, outMatrix = null) {
		const buffer = new Matrix3x3();
		outMatrix = Matrix3x3.ofTranslation(translation.x, -translation.y, outMatrix);
		outMatrix.multiply(Matrix3x3.ofRotation(angle, buffer), outMatrix);
		return outMatrix.multiply(Matrix3x3.ofScaling(scaling.x, scaling.y, buffer), outMatrix);
	}

	/**
	 * @param {number}    left      Левая граница экрана.
	 * @param {number}    right     Правая граница экрана.
	 * @param {number}    bottom    Нижняя граница экрана.
	 * @param {number}    top       Верхняя граница экрана.
	 * @param {Matrix3x3} outMatrix Матрица 3x3, в которую можно записать результат.
	 * 
	 * @return {Matrix3x3} Возвращает матрицу ортографической проекции.
	 */
	static ofOrthographicProjection(left, right, bottom, top, outMatrix) {
		if (outMatrix != null && !(outMatrix instanceof Matrix3x3)) {
			throw new TypeError('invalid parameter "outMatrix". Expected an instance of Matrix3x3 class.');
		}
		if (typeof left != 'number') {
			throw new TypeError('invalid parameter "left". Expected a number.');
		}
		if (typeof right != 'number') {
			throw new TypeError('invalid parameter "right". Expected a number.');
		}
		if (typeof bottom != 'number') {
			throw new TypeError('invalid parameter "bottom". Expected a number.');
		}
		if (typeof top != 'number') {
			throw new TypeError('invalid parameter "top". Expected a number.');
		}
		const result = outMatrix || new Matrix3x3();
		result[0] = 2 / (right - left);
		result[4] = 2 / (top - bottom);
		result[6] = -(right + left) / (right - left);
		result[7] = -(top + bottom) / (top - bottom);
		result[8] = 1;
		if (outMatrix != null) {
			result[1] = result[2] = result[3] = result[5] = 0;
		}
		return result;
	}

	/**
	 * @return {number} Возвращает определитель матрицы.
	 */
	det() {
		const k1 = this[0] * (this[4] * this[8] - this[7] * this[5]);
		const k2 = this[1] * (this[3] * this[8] - this[6] * this[5]);
		const k3 = this[2] * (this[3] * this[7] - this[6] * this[4]);
		return k1 - k2 + k3;
	}

	/**
	 * @return {Matrix3x3} Возвращает обратную матрицу данной (если матрица не обратима, возвращает null).
	 */
	inverse(outMatrix) {
		if (outMatrix != null && !(outMatrix instanceof Matrix3x3)) {
			throw new TypeError('invalid parameter "outMatrix". Expected an instance of Matrix3x3 class.');
		}
		const k1 = this[4] * this[8] - this[7] * this[5];
		const k2 = this[3] * this[8] - this[6] * this[5];
		const k3 = this[3] * this[7] - this[6] * this[4];
		const det = this[0] * k1 - this[1] * k2 + this[2] * k3;
		if (det === 0) {
			return null;
		}
		const invDet = 1 / det;
		const result = outMatrix || new Matrix3x3();
		result[0] = k1 * invDet;
		result[3] = -k2 * invDet;
		result[6] = k3 * invDet;
		result[1] = (this[7] * this[2] - this[1] * this[8]) * invDet;
		result[4] = (this[0] * this[8] - this[6] * this[2]) * invDet;
		result[7] = (this[6] * this[1] - this[0] * this[7]) * invDet;
		result[2] = (this[1] * this[5] - this[4] * this[2]) * invDet;
		result[5] = (this[3] * this[2] - this[0] * this[5]) * invDet;
		result[8] = (this[0] * this[4] - this[3] * this[1]) * invDet;
		return result;
	}

	/**
	 * Умножает данную матрицу на матрицу 3x3.
	 * 
	 * @param {Matrix3x3} matrix    Матрица 3x3, на которую надо умножить.
	 * @param {Matrix3x3} outMatrix Матрица 3x3, в которую можно записать результат.
	 * 
	 * @return {Matrix3x3} Возвращает результат умножения.
	 */
	multiply(matrix, outMatrix = null) {
		if (!(matrix instanceof Matrix3x3)) {
			throw new TypeError('invalid parameter "matrix". Expected an instance of Matrix3x3 class.');
		}
		if (outMatrix != null && !(outMatrix instanceof Matrix3x3)) {
			throw new TypeError('invalid parameter "outMatrix". Expected an instance of Matrix3x3 class.');
		}
		const a00 = this[0];
		const a01 = this[1];
		const a02 = this[2];
		const a10 = this[3];
		const a11 = this[4];
		const a12 = this[5];
		const a20 = this[6];
		const a21 = this[7];
		const a22 = this[8];
		
		const b00 = matrix[0];
		const b01 = matrix[1];
		const b02 = matrix[2];
		const b10 = matrix[3];
		const b11 = matrix[4];
		const b12 = matrix[5];
		const b20 = matrix[6];
		const b21 = matrix[7];
		const b22 = matrix[8];

		const result = outMatrix || new Matrix3x3();
		result[0] = a00 * b00 + a10 * b01 + a20 * b02;
		result[1] = a01 * b00 + a11 * b01 + a21 * b02;
		result[2] = a02 * b00 + a12 * b01 + a22 * b02;
		result[3] = a00 * b10 + a10 * b11 + a20 * b12;
		result[4] = a01 * b10 + a11 * b11 + a21 * b12;
		result[5] = a02 * b10 + a12 * b11 + a22 * b12;
		result[6] = a00 * b20 + a10 * b21 + a20 * b22;
		result[7] = a01 * b20 + a11 * b21 + a21 * b22;
		result[8] = a02 * b20 + a12 * b21 + a22 * b22;
		return result;
	}

	/**
	 * Умножает матрицу на вектор (vector.x, vector.y, 1).
	 * 
	 * @param {Vector2d} vector Вектор, на который надо умножить.
	 * 
	 * @return {Vector2d} Возвращает вектор, полученный из xy результата умножения.
	 */
	multiplyByVector(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return new Vector2d(
			this[0] * vector.x + this[3] * vector.y + this[6],
			this[1] * vector.x + this[4] * vector.y + this[7],
		);
	}
}
