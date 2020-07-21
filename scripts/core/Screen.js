import Vector2d from './Vector2d.js';
import Rect from './graphics/Rect.js';

export default class Screen {
	/**
	 * @type {HTMLCanvasElement}
	 */
	static canvas = null;

	/**
	 * @return {Vector2d} Возвращает размер экрана.
	 */
	static getSize() {
		if (Screen.canvas == null) {
			throw new Error('screen is not initialized.');
		}
		return new Vector2d(Screen.canvas.clientWidth, Screen.canvas.clientHeight)
	}

	/**
	 * @param {Vector2d} size Новый размер экрана.
	 */
	static setSize(size) {
		if (!(size instanceof Vector2d)) {
			throw new TypeError('invalid parameter "size". Expected an instance of Vector2d class.');
		}
		if (Screen.canvas == null) {
			throw new Error('screen is not initialized.');
		}
		if (size.x <= 0) {
			throw new RangeError('width must be greater than 0.');
		}
		if (size.y <= 0) {
			throw new RangeError('height must be greater than 0.');
		}
		Screen.canvas.width = size.x;
		Screen.canvas.height = size.y;
	}

	/**
	 * @return {Rect} Возвращает прямоугольник, который содержит позицию и размер элемента canvas.
	 */
	static getCanvasRect() {
		if (Screen.canvas == null) {
			throw new Error('screen is not initialized.');
		}
		return new Rect(
			this.canvas.offsetLeft,
			this.canvas.offsetTop,
			this.canvas.clientWidth,
			this.canvas.clientHeight,
		);
	}

	/**
	 * @param {HTMLCanvasElement} canvas
	 */
	static initialize(canvas) {
		if (!(canvas instanceof HTMLCanvasElement)) {
			throw new TypeError('invalid parameter "canvas". Expected an instance of HTMLCanvasElement class.');
		}
		Screen.canvas = canvas;
	}

	static destroy() {
		Screen.canvas = null;
	}
}
