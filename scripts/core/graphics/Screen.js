import Vector2d from '../mathematics/Vector2d.js';
import Rect from './Rect.js';

export default class Screen {
	/**
	 * @type {HTMLCanvasElement}
	 */
	static canvas = null;

	/**
	 * @type {Vector2d}
	 */
	static size;

	/**
	 * @type {Vector2d}
	 */
	static unprocessedSize;

	/**
	 * @param {Vector2d} size Новый размер экрана.
	 */
	static setSize(size) {
		if (!(size instanceof Vector2d)) {
			throw new TypeError('invalid parameter "size". Expected an instance of Vector2d class.');
		}

		if (size.x <= 0) {
			throw new RangeError('width must be greater than 0.');
		}

		if (size.y <= 0) {
			throw new RangeError('height must be greater than 0.');
		}

		this.unprocessedSize = size;
	}

	/**
	 * @return {Rect} Возвращает прямоугольник, который содержит позицию и размер элемента canvas.
	 */
	static getCanvasRect() {
		if (this.canvas == null) {
			throw new Error('screen is not initialized.');
		}

		return new Rect(
			this.canvas.offsetLeft,
			this.canvas.offsetTop,
			this.canvas.clientWidth,
			this.canvas.clientHeight,
		);
	}

	static process() {
		if (this.unprocessedSize != null) {
			this.size = this.unprocessedSize;
			this.unprocessedSize = null;
			this.canvas.width = this.size.x;
			this.canvas.height = this.size.y;
		}
	}

	/**
	 * @param {HTMLCanvasElement} canvas
	 */
	static initialize(canvas) {
		if (!(canvas instanceof HTMLCanvasElement)) {
			throw new TypeError('invalid parameter "canvas". Expected an instance of HTMLCanvasElement class.');
		}

		this.canvas = canvas;
		this.size = new Vector2d(this.canvas.clientWidth, this.canvas.clientHeight);
	}

	static destroy() {
		this.canvas = null;
		this.unprocessedSize = null;
		this.size = null;
	}
}
