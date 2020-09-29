import Vector2d from './Vector2d.js';
import Matrix3x3 from './Matrix3x3.js';

export default class Matrix2x2 extends Float32Array {
	constructor() {
		super(4);
	}

	/**
	 * @param {number} a00 Элемент в 0 строчке 0 столбца.
	 * @param {number} a10 Элемент в 1 строчке 0 столбца.
	 * @param {number} a01 Элемент в 0 строчке 1 столбца.
	 * @param {number} a11 Элемент в 1 строчке 1 столбца.
	 * 
	 * @return {Matrix2x2} Возвращает матрицу 2x2, созданную из переданных значений.
	 */
	static fromValues(
		a00, a10,
		a01, a11,
	) {
		const assert = (x, name) => {
			if (typeof x != 'number') {
				throw new TypeError(`invalid parameter "${name}". Expected a number.`);
			}
			return x;
		}
		const matrix2x2 = new Matrix2x2();
		matrix2x2[0] = assert(a00, 'a00');
		matrix2x2[1] = assert(a10, 'a10');
		matrix2x2[2] = assert(a01, 'a01');
		matrix2x2[3] = assert(a11, 'a11');
		return matrix2x2;
	}

	/**
	 * @param {Matrix3x3} matrix3x3
	 * 
	 * @return {Matrix2x2} Возвращает матрицу 2x2, созданную путем взятия элементов из левого угла матрицы 3x3.
	 */
	static fromMatrix3x3(matrix3x3) {
		if (!(matrix3x3 instanceof Matrix3x3)) {
			throw new TypeError('invalid parameter "matrix3x3". Expected an instance of Matrix3x3 class.');
		}
		const matrix2x2 = new Matrix2x2();
		matrix2x2[0] = matrix3x3[0];
		matrix2x2[1] = matrix3x3[1];
		matrix2x2[2] = matrix3x3[3];
		matrix2x2[3] = matrix3x3[4];
		return matrix2x2;
	}

	/**
	 * @param {number} angle Угол поворота в радианах.
	 * 
	 * @return {Matrix2x2} Возвращает матрицу поворота. 
	 */
	static ofRotation(angle) {
		const matrix = new Matrix2x2();
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		matrix[0] = cos;
		matrix[1] = -sin;
		matrix[2] = sin;
		matrix[3] = cos;
		return matrix;
	}

	/**
	 * @return {Matrix2x2} Возвращает матрицу, полученную транспонированием данной.
	 */
	transpose() {
		const matrix = new Matrix2x2();
		matrix[0] = this[0];
		matrix[1] = this[2];
		matrix[2] = this[1];
		matrix[3] = this[3];
		return matrix;
	}

	/**
	 * Умножает данную матрицу на матрицу 2x2.
	 * 
	 * @param {Matrix2x2} matrix Матрица 2x2, на которую надо умножить.
	 * 
	 * @return {Matrix2x2} Возвращает результат умножения.
	 */
	multiply(matrix2x2) {
		if (!(matrix2x2 instanceof Matrix2x2)) {
			throw new TypeError('invalid parameter "matrix2x2". Expected an instance of Matrix2x2 class.');
		}
		const product = new Matrix2x2();
		product[0] = this[0] * matrix2x2[0] + this[2] * matrix2x2[1];
		product[1] = this[1] * matrix2x2[0] + this[3] * matrix2x2[1];
		product[2] = this[0] * matrix2x2[2] + this[2] * matrix2x2[3];
		product[3] = this[1] * matrix2x2[2] + this[3] * matrix2x2[3];
		return product;
	}

	/**
	 * @return {number} Возвращает определитель данной матрицы.
	 */
	det() {
		return this[0] * this[3] - this[2] * this[1];
	}

	/**
	 * @return {Matrix2x2} Возвращает обратную матрицу данной (если матрица не обратима, возвращает null).
	 */
	inverse() {
		const invMatrix2x2 = new Matrix2x2();
		const det = this.det();
		if (det === 0) {
			return null;
		}
		invMatrix2x2[0] = this[3] / det;
		invMatrix2x2[1] = -this[1] / det;
		invMatrix2x2[2] = -this[2] / det;
		invMatrix2x2[3] = this[0] / det;
		return invMatrix2x2;
	}

	/**
	 * Умножает матрицу на вектор.
	 * 
	 * @param {Vector2d} vector
	 * 
	 * @return {Vector2d}
	 */
	multiplyByVector(vector) {
		if (!(vector instanceof Vector2d)) {
			throw new TypeError('invalid parameter "vector". Expected an instance of Vector2d class.');
		}
		return new Vector2d(
			this[0] * vector.x + this[2] * vector.y,
			this[1] * vector.x + this[3] * vector.y,
		);
	}
}