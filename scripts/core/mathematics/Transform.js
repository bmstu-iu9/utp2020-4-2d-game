import Vector2d from './Vector2d.js';
import Matrix3x3 from './Matrix3x3.js';

export default class Transform {
	/**
	 * @param {boolean}  isStatic Является ли преобразование статичным.
	 * @param {Vector2d} position Позиция.
	 * @param {number}   rotation Угол поворота в радианах.
	 * @param {Vector2d} scale    Масштаб.
	 */
	constructor(isStatic = false, position = Vector2d.zero, rotation = 0, scale = new Vector2d(1, 1)) {
		if (typeof isStatic !== 'boolean') {
			throw new TypeError('invalid parameter "isStatic". Expected a boolean value.');
		}
		if (!(position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}
		if (typeof rotation !== 'number') {
			throw new TypeError('invalid parameter "rotation". Expected a number.');
		}
		if (!(scale instanceof Vector2d)) {
			throw new TypeError('invalid parameter "scale". Expected an instance of Vector2d class.');
		}
		/**
		 * @type {Vector2d}
		 */
		this.position = position;
		/**
		 * @type {number}
		 */
		this.rotation = this.clampAngle(rotation);
		this.angle = this.rotation / Math.PI * 180;
		/**
		 * @type {Vector2d}
		 */
		this.scale = scale;
		this.isStatic = isStatic;
		this.isDirty = true;
		this.updateMatrices();
	}

	/**
	 * Выбрасывает ошибку, если преобразование статичное.
	 */
	throwIfStatic() {
		if (this.isStatic) {
			throw new Error('attempt to modify a static transform.');
		}
	}

	/**
	 * Ограничивает угол от 0 до 2 pi.
	 * 
	 * @param {number} angle Угол в радианах.
	 * 
	 * @return {number} Возвращает ограниченный угол.
	 */
	clampAngle(angle) {
		if (typeof angle !== 'number') {
			throw new TypeError('invalid parameter "angle". Expected a number.');
		}
		const border = -angle / Math.PI / 2;
		let n = Math.floor(border);
		if (n < border) {
			n++;
		}
		return angle + 2 * Math.PI * n;
	}

	/**
	 * Обновляет матрицы преобразования.
	 */
	updateMatrices() {
		if (!this.isDirty) {
			return;
		}
		/**
		 * @type {Matrix3x3}
		 */
		this.worldMatrix = Matrix3x3.ofTranslationRotationScaling(
			this.position,
			this.rotation,
			this.scale,
			this.worldMatrix,
		);
		this.isDirty = false;
	}

	/**
	 * Изменяет позицию.
	 * 
	 * @param {Vector2d} position Новая позиция.
	 */
	setPosition(position) {
		this.throwIfStatic();
		if (!(position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}
		if (this.position.equals(position)) {
			return;
		}
		this.isDirty = true;
		this.position = position;
		this.updateMatrices();
	}

	/**
	 * Изменяет угол поворота.
	 * 
	 * @param {number} angle Новый угол поворота в радианах.
	 */
	setRotation(angle) {
		this.throwIfStatic();
		if (typeof angle !== 'number') {
			throw new TypeError('invalid parameter "angle". Expected a number.');
		}
		if (this.angle === angle) {
			return;
		}
		this.isDirty = true;
		this.rotation = this.clampAngle(angle);
		this.angle = this.rotation / Math.PI * 180;
		this.updateMatrices();
	}

	/**
	 * Изменяет масштаб.
	 * 
	 * @param {Vector2d} scale Новый масштаб.
	 */
	setScale(scale) {
		this.throwIfStatic();
		if (!(scale instanceof Vector2d)) {
			throw new TypeError('invalid parameter "scale". Expected an instance of Vector2d class.');
		}
		if (this.scale.equals(scale)) {
			return;
		}
		this.isDirty = true;
		this.scale = scale;
		this.updateMatrices();
	}

	/**
	 * @param {Vector2d} point Точка, которую нужно преобразовать.
	 * 
	 * @param {Vector2d} Возвращает преобразованную точку.
	 */
	transformPoint(point) {
		if (!(point instanceof Vector2d)) {
			throw new TypeError('invalid parameter "point". Expected an instance of Vector2d class.');
		}
		return this.worldMatrix.multiplyByVector(point);
	}
}
