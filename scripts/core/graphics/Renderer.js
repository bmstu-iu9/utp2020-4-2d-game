import GameComponent from '../GameComponent.js';
import Camera from './Camera.js';

export default class Renderer extends GameComponent {
	constructor() {
		super();
		if (new.target === Renderer) {
			throw new TypeError('cannot create instance of abstract class.');
		}
	}

	allowMultipleComponents() {
		return false;
	}

	/**
	 * Что-то отрисовывается (зависит от реализации).
	 * 
	 * @param {Camera}                   camera  Камера, в которой будет происходить отрисовка.
	 * @param {CanvasRenderingContext2D} context Контекст, в котором будет происходить отрисовка.
	 */
	draw(camera, context) {
		throw new Error('not implemented.');
	}
}
