import Transform from './Transform.js';
import HierarchyObject from '../HierarchyObject.js';
import Vector2d from './Vector2d.js';
import Matrix3x3 from './Matrix3x3.js';

export default class HierarchyTransform extends Transform {
	/**
	 * @param {HierarchyObject} hierarchyObject Объект иерархии, к которому привяжется преобразование.
	 * @param {boolean}         isStatic        Является ли преобразование статичным.
	 * @param {Vector2d}        position        Позиция.
	 * @param {number}          rotation        Угол поворота в радианах.
	 * @param {Vector2d}        scale           Масштаб.
	 */
	constructor(
		hierarchyObject,
		isStatic = false,
		position = Vector2d.zero,
		rotation = 0,
		scale = new Vector2d(1, 1)
	) {
		super(isStatic, position, rotation, scale);
		if (!(hierarchyObject instanceof HierarchyObject)) {
			throw new TypeError('invalid parameter "hierarchyObject". Expected an instance of HierarchyObject class.');
		}
		/**
		 * @type {Vector2d}
		 */
		this.localPosition = position;
		/**
		 * @type {number}
		 */
		this.localRotation = this.clampAngle(rotation);
		this.localAngle = this.localRotation / Math.PI * 180;
		/**
		 * @type {Vector2d}
		 */
		this.localScale = scale;
		this.hierarchyObject = hierarchyObject;
		this.isDirty = true;
		this.updateMatrices();
	}

	/**
	 * @param {boolean} isForceUpdate Надо ли принудительно изменить worldMatrix.
	 */
	updateMatrices(isForceUpdate = false) {
		if (this.hierarchyObject == null) {
			return;
		}
		if (this.isDirty) {
			this.localMatrix = Matrix3x3.ofTranslationRotationScaling(
				this.localPosition,
				this.localRotation,
				this.localScale,
				this.localMatrix,
			);
		}
		const parent = this.hierarchyObject.parent;
		if (parent == null) {
			this.worldMatrix = this.localMatrix;
			if (!this.isDirty && !isForceUpdate) {
				return;
			}
		} else {
			if (this.isDirty || parent.transform.isDirty || isForceUpdate) {
				this.worldMatrix = parent.transform.worldMatrix.multiply(
					this.localMatrix,
					this.worldMatrix != this.localMatrix ? this.worldMatrix : null,
				);
			} else if (!this.isDirty) {
				return;
			}
		}
		if (parent == null) {
			this.position = this.localPosition;
			this.rotation = this.localRotation;
			this.scale = this.localScale;
		} else {
			this.position = new Vector2d(this.worldMatrix[6], -this.worldMatrix[7]);
			this.rotation = this.clampAngle(Math.atan2(this.worldMatrix[1], this.worldMatrix[0]));
			let signX = Math.sign(this.localScale.x * parent.transform.scale.x);
			let signY = Math.sign(this.localScale.y * parent.transform.scale.y);
			this.scale = new Vector2d(
				signX * new Vector2d(this.worldMatrix[0], this.worldMatrix[1]).length(),
				signY * new Vector2d(this.worldMatrix[3], this.worldMatrix[4]).length(),
			);
		}
		this.angle = this.rotation / Math.PI * 180;
		this.hierarchyObject.children.forEach(child => child.transform.updateMatrices(true));
		this.isDirty = false;
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
		const delta = this.position.subtract(position);
		this.localPosition = this.localPosition.subtract(delta);
		this.updateMatrices();
	}

	/**
	 * Изменяет позицию в локальных координатах.
	 * 
	 * @param {Vector2d} position Новая позиция.
	 */
	setLocalPosition(position) {
		this.throwIfStatic();
		if (!(position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}
		if (this.localPosition.equals(position)) {
			return;
		}
		this.isDirty = true;
		this.localPosition = position;
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
		const delta = this.rotation - angle;
		this.localRotation = this.clampAngle(this.localRotation - delta);
		this.localAngle = this.localRotation / Math.PI * 180;
		this.updateMatrices();
	}

	/**
	 * Изменяет локальный угол поворота.
	 * 
	 * @param {number} angle Новый локальный угол поворота в радианах.
	 */
	setLocalRotation(angle) {
		this.throwIfStatic();
		if (typeof angle !== 'number') {
			throw new TypeError('invalid parameter "angle". Expected a number.');
		}
		if (this.localRotation === angle) {
			return;
		}
		this.isDirty = true;
		this.localRotation = this.clampAngle(angle);
		this.localAngle = this.localRotation / Math.PI * 180;
		this.updateMatrices();
	}

	/**
	 * Не поддерживается. Использовать setLocalScale(scale) для изменения масштаба.
	 * Причина: потеря точности в мировом масштабе.
	 */
	setScale() {
		throw new Error('unsupported.');
	}

	/**
	 * Изменяет локальный масштаб.
	 * 
	 * @param {Vector2d} scale Новый локальный масштаб.
	 */
	setLocalScale(scale) {
		this.throwIfStatic();
		if (!(scale instanceof Vector2d)) {
			throw new TypeError('invalid parameter "scale". Expected an instance of Vector2d class.');
		}
		if (this.localScale.equals(scale)) {
			return;
		}
		this.isDirty = true;
		this.localScale = scale;
		this.updateMatrices();
	}
}
