import Transform from './Transform.js';
import Camera from '../graphics/Camera.js';
import Matrix3x3 from './Matrix3x3.js';
import Vector2d from './Vector2d.js';
import Maths from './Maths.js';

export default class CameraTransform extends Transform {
	/**
	 * @param {Camera}   camera   Камера, к которой привяжется преобразование.
	 * @param {boolean}  isStatic Является ли преобразование статичным.
	 * @param {Vector2d} position Позиция.
	 * @param {number}   rotation Угол поворота в радианах.
	 */
	constructor(
		camera,
		isStatic = false,
		position = Vector2d.zero,
		rotation = 0,
	) {
		super();
		if (!(camera instanceof Camera)) {
			throw new TypeError('invalid parameter "camera". Expected an instance of Camera class.');
		}
		if (typeof isStatic !== 'boolean') {
			throw new TypeError('invalid parameter "isStatic". Expected a boolean value.');
		}
		if (!(position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}
		if (typeof rotation !== 'number') {
			throw new TypeError('invalid parameter "rotation". Expected a number.');
		}
		/**
		 * @type {Vector2d}
		 */
		this.position = position;
		/**
		 * @type {number}
		 */
		this.rotation = this.clampAngle(rotation);
		this.angle = Maths.toDegrees(this.rotation);
		this.scale = new Vector2d(1, 1);
		this.camera = camera;
		this.isStatic = isStatic;
		this.isDirty = true;
	}

	updateMatrices() {
		if (this.camera == null) {
			return;
		}
		if (this.isDirty) {
			const translation = Matrix3x3.ofTranslation(this.position.x, this.position.y);
			/**
			 * @type {Matrix3x3}
			 */
			this.worldMatrix = translation.multiply(Matrix3x3.ofRotation(this.rotation), this.worldMatrix);
			this.camera.updateViewProjectionMatrix();
		}
	}

	/**
	 * Изменяет позицию в мировых координатах.
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
	 * Изменяет мировой угол поворота.
	 * 
	 * @param {number} angle Новый мировой угол поворота в радианах.
	 */
	setRotation(angle) {
		this.throwIfStatic();
		if (typeof angle !== 'number') {
			throw new TypeError('invalid parameter "angle". Expected a number.');
		}
		if (this.rotation === angle) {
			return;
		}
		this.isDirty = true;
		this.rotation = this.clampAngle(angle);
		this.angle = Maths.toDegrees(this.rotation);
		this.updateMatrices();
	}
}
