import Vector2d from './Vector2d.js';
import Matrix3x3 from './Matrix3x3.js';

export default class Transform {
	constructor() {
		if (new.target === Transform) {
			throw new TypeError('cannot create instance of abstract class.');
		}
		this.position = Vector2d.zero;
		this.rotation = 0;
		this.angle = 0;
		this.scale = new Vector2d(1, 1);
		this.isStatic = false;
		/**
		 * @type {Matrix3x3}
		 */
		this.worldMatrix = null;
		this.changeId = {};
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
	 * Изменяет позицию.
	 * 
	 * @param {Vector2d} position Новая позиция.
	 */
	setPosition(position) {
		throw new Error('not implemented.');
	}

	/**
	 * Изменяет угол поворота.
	 * 
	 * @param {number} angle Новый угол поворота в радианах.
	 */
	setRotation(angle) {
		throw new Error('not implemented.');
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
