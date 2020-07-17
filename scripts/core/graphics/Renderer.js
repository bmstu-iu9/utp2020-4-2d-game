import Component from '../Component.js';

export default class Renderer extends Component {
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
	 * @param {CanvasRenderingContext2D} context Контекст, в котором будет происходить отрисовка.
	 */
	onDraw(context) {
		throw new Error('not implemented.');
	}
}
