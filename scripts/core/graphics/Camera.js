import ComponentObject from '../ComponentObject.js';
import RendererComponent from './RendererComponent.js';
import Vector2d from '../mathematics/Vector2d.js';
import Screen from './Screen.js';
import Component from '../Component.js';
import Color from './Color.js';
import Matrix3x3 from '../mathematics/Matrix3x3.js';
import CameraTransform from '../mathematics/CameraTransform.js';
import Renderer from './webgl/Renderer.js';

export default class Camera extends ComponentObject {
	/**
	 * @param {object}      settings            Настройки камеры.
	 * @param {string}      settings.name       Название камеры.
	 * @param {number}      settings.width      Ширина камеры в пикселях.
	 * @param {number}      settings.height     Высота камеры в пикселях.
	 * @param {number}      settings.zoom       Половина высоты камеры в условных единицах.
	 * @param {Color}       settings.clearColor Цвет фона.
	 * @param {boolean}     settings.isEnabled  Влючена ли камера.
	 * @param {boolean}     settings.isStatic   Должна ли камера быть статичной.
	 * @param {Vector2d}    settings.position   Позиция камеры.
	 * @param {number}      settings.rotation   Угол поворота камеры в радианах.
	 * @param {Vector2d}    settings.scale      Масштаб камеры.
	 * @param {Component[]} settings.components Компоненты камеры.
	 */
	constructor({
		name,
		width,
		height,
		zoom = 1,
		clearColor = Color.black,
		isEnabled = true,
		isStatic = false,
		position = Vector2d.zero,
		rotation = 0,
		scale = new Vector2d(1, 1),
		components = [],
	}) {
		super(isEnabled);
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}
		if (name.trim() === '') {
			throw new Error('invalid parameter "name". Expected a non-empty string.');
		}
		if (typeof width !== 'number') {
			throw new TypeError('invalid parameter "width". Expected a number.');
		}
		if (typeof height !== 'number') {
			throw new TypeError('invalid parameter "height". Expected a number.');
		}
		if (typeof zoom !== 'number') {
			throw new TypeError('invalid parameter "zoom". Expected a number.');
		}
		if (!(clearColor instanceof Color)) {
			throw new TypeError('invalid parameter "clearColor". Expected an instance of Color class.');
		}
		if (typeof isStatic !== 'boolean') {
			throw new TypeError('invalid parameter "isStatic". Expected a boolean value.');
		}
		if (!Array.isArray(components)) {
			throw new TypeError('invalid parameter "components". Expected an array.');
		}

		this.name = name;
		this.clearColor = clearColor;
		this.width = width;
		this.height = height;
		this.aspectRatio = width / height;
		this.zoom = zoom;
		this.projectionMatrix = Matrix3x3.ofOrthographicProjection(
			-this.aspectRatio * zoom,
			this.aspectRatio * zoom,
			-zoom,
			zoom,
			this.projectionMatrix,
		);
		this.transform = new CameraTransform(this, isStatic, position, rotation, scale);
		this.transform.updateMatrices();
		components.forEach(component => this.addComponent(component));
	}

	updateViewProjectionMatrix() {
		/**
		 * @type {Matrix3x3}
		 */
		this.viewMatrix = this.transform.worldMatrix.inverse(this.viewMatrix);
		/**
		 * @type {Matrix3x3}
		 */
		this.viewProjectionMatrix = this.projectionMatrix.multiply(this.viewMatrix, this.viewProjectionMatrix);
	}

	updateProjectionMatrix() {
		/**
		 * @type {Matrix3x3}
		 */
		this.viewProjectionMatrix = this.projectionMatrix.multiply(this.viewMatrix, this.viewProjectionMatrix);
	}

	/**
	 * Устанавливает матрицу проекции.
	 * 
	 * @param {number} width  Ширина камеры в пикселях.
	 * @param {number} height Высота камеры в пикселях.
	 * @param {number} zoom   Половина высоты камеры в условных единицах.
	 */
	setProjection(width, height, zoom) {
		if (typeof width !== 'number') {
			throw new TypeError('invalid parameter "width". Expected a number.');
		}
		if (typeof height !== 'number') {
			throw new TypeError('invalid parameter "height". Expected a number.');
		}
		if (typeof zoom !== 'number') {
			throw new TypeError('invalid parameter "zoom". Expected a number.');
		}
		this.width = width;
		this.height = height;
		this.aspectRatio = width / height;
		this.zoom = zoom;
		/**
		 * @type {Matrix3x3}
		 */
		this.projectionMatrix = Matrix3x3.ofOrthographicProjection(
			-this.aspectRatio * zoom,
			this.aspectRatio * zoom,
			-zoom,
			zoom,
			this.projectionMatrix,
		);
		this.updateProjectionMatrix();
	}

	/**
	 * Устанавливает высоту камеры в условных единицах.
	 * 
	 * @param {number} zoom Половина высоты камеры в условных единицах.
	 */
	setZoom(zoom) {
		if (typeof zoom !== 'number') {
			throw new TypeError('invalid parameter "zoom". Expected a number.');
		}
		this.zoom = zoom;
		/**
		 * @type {Matrix3x3}
		 */
		this.projectionMatrix = Matrix3x3.ofOrthographicProjection(
			-this.aspectRatio * zoom,
			this.aspectRatio * zoom,
			-zoom,
			zoom,
			this.projectionMatrix,
		);
		this.updateProjectionMatrix();
	}

	/**
	 * @param {Vector2d} position Позиция в мировых координатах.
	 * 
	 * @return {Vector2d} Возвращает переданную позицию в координатах данной камеры.
	 */
	worldToCameraPosition(position) {
		if (!(position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}
		position = new Vector2d(position.x, -position.y);
		position = position.add(Screen.getSize().multiply(0.5));
		return position.subtract(new Vector2d(this.transform.position.x * 100, -this.transform.position.y * 100));
	}

	/**
	 * @param {Vector2d} position Позиция в координатах данной камеры.
	 * 
	 * @return {Vector2d} Возвращает переданную позицию в мировых координатах.
	 */
	cameraToWorldPosition(position) {
		if (!(position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}
		position = position.add(new Vector2d(this.transform.position.x * 100, -this.transform.position.y * 100));
		position = position.subtract(Screen.getSize().multiply(0.5));
		return new Vector2d(position.x, -position.y);
	}

	/**
	 * Отрисовывает объекты, которые попадают в данную камеру.
	 * 
	 * @param {RendererComponent[]} renderers Компоненты игровых объектов, которые будут что-то отрисовывать.
	 */
	draw(renderers) {
		this.throwIfNotInitialized();
		this.throwIfDestroyed();
		Renderer.clear(0, 0, Screen.getSize(), this.clearColor);
		Renderer.begin(this);

		renderers.forEach(renderer => renderer.draw(this));

		Renderer.end();
	}
}
