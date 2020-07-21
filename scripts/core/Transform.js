import Vector2d from './Vector2d.js';

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

		this.setPosition(position);
		this.setRotation(rotation);
		this.setScale(scale);
		this.isStatic = isStatic;
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
	 * Изменяет позицию.
	 * 
	 * @param {Vector2d} position Новая позиция.
	 */
	setPosition(position) {
		this.throwIfStatic();
		if (!(position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}
		this.position = position.copy();
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
		this.rotation = angle;
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
		this.scale = scale.copy();
	}
}
