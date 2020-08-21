import ComponentObject from '../ComponentObject.js';
import Renderer from './Renderer.js';
import Vector2d from '../mathematics/Vector2d.js';
import Transform from '../mathematics/Transform.js';
import Screen from './Screen.js';
import Component from '../Component.js';
import Color from './Color.js';

export default class Camera extends ComponentObject {
	/**
	 * @param {object}      settings            Настройки камеры.
	 * @param {string}      settings.name       Название камеры.
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
		this.transform = new Transform(isStatic, position, rotation, scale);
		components.forEach(component => this.addComponent(component));
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
	 * @param {Renderer[]}               renderers Компоненты игровых объектов, которые будут что-то отрисовывать.
	 * @param {CanvasRenderingContext2D} context   Контекст, в котором будет происходить отрисовка.
	 */
	draw(renderers, context) {
		this.throwIfNotInitialized();
		this.throwIfDestroyed();
		context.imageSmoothingEnabled = false;
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		const size = Screen.getSize();
		context.fillStyle = this.clearColor.rgbString();
		context.fillRect(0, 0, size.x, size.y);
		
		context.translate(size.x / 2, size.y / 2);
		context.scale(this.transform.scale.x, this.transform.scale.y);
		context.rotate(-this.transform.rotation);
		context.translate(-size.x / 2, -size.y / 2);

		renderers.forEach(renderer => renderer.draw(this, context));

		context.translate(size.x / 2, size.y / 2);
		context.rotate(this.transform.rotation);
		context.scale(1 / this.transform.scale.x, 1 / this.transform.scale.y);
		context.translate(-size.x / 2, -size.y / 2);
	}
}
