import GameComponent from '../GameComponent.js';
import Camera from './Camera.js';

export default class RendererComponent extends GameComponent {
	/**
	 * @param {number} layer Слой отрисовки.
	 */
	constructor(layer) {
		super();
		if (new.target === RendererComponent) {
			throw new TypeError('cannot create instance of abstract class.');
		}
		this.setLayer(layer);
	}

	allowMultipleComponents() {
		return false;
	}

	/**
	 * Устанавливает слой отрисовки.
	 * 
	 * @param {number} layer Слой отрисовки.
	 */
	setLayer(layer) {
		if (typeof layer !== 'number') {
			throw new TypeError('invalid parameter "layer". Expected a number.');
		}
		this.layer = layer;
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
