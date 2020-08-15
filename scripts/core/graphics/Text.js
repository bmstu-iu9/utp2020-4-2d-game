import Renderer from './Renderer.js';
import Vector2d from '../mathematics/Vector2d.js';
import Color from './Color.js';

export default class Text extends Renderer {
	/**
	 * @param {object} settings          Настройки текста.
	 * @param {string} settings.text     Текст, который будет отображаться.
	 * @param {number} settings.maxWidth Максимальная ширина текста.
	 * @param {Color}  settings.color    Цвет текста.
	 * @param {string} settings.font     Настройки шрифта.
	 * @param {number} settings.layer    Слой отрисовки.
	 */
	constructor({
		text,
		maxWidth = null,
		color = Color.white,
		font = null,
		layer = 0
	}) {
		super(layer);
		this.setText(text);
		this.setMaxWidth(maxWidth);
		this.setColor(color);
		this.setFont(font);
	}

	/**
	 * Устанавливает текст, который будет отображаться.
	 * 
	 * @param {string} text Текст, который будет отображаться.
	 */
	setText(text) {
		if (typeof text !== 'string') {
			throw new TypeError('invalid parameter "text". Expected a string.');
		}
		this.text = text;
	}

	/**
	 * Устанавливает настройки шрифта.
	 * Можно передать null, чтобы установить шрифт по умолчанию.
	 * 
	 * @param {string} font Настройки шрифта.
	 */
	setFont(font) {
		if (font != null && typeof font !== 'string') {
			throw new TypeError('invalid parameter "font". Expected a string.');
		}
		this.font = font;
	}

	/**
	 * Устанавливает цвет текста.
	 * 
	 * @param {Color} color Цвет текста.
	 */
	setColor(color) {
		if (!(color instanceof Color)) {
			throw new TypeError('invalid parameter "color". Expected an instance of Color class.');
		}
		this.color = color;
	}

	/**
	 * Устанавливает максимальную ширину шрифта.
	 * Можно передать null, чтобы установить значение по умолчанию.
	 * 
	 * @param {number} maxWidth Максимальный размер шрифта.
	 */
	setMaxWidth(maxWidth) {
		if (maxWidth != null && typeof maxWidth !== 'number') {
			throw new TypeError('invalid parameter "maxWidth". Expected a number.');
		}
		this.maxWidth = maxWidth;
	}

	/**
	 * Отрисовывает текст.
	 * 
	 * @param {Camera}                   camera  Камера, в которой будет происходить отрисовка.
	 * @param {CanvasRenderingContext2D} context Контекст, в котором будет происходить отрисовка.
	 */
	draw(camera, context) {
		const offset = camera.worldToCameraPosition(Vector2d.zero);

		context.save();
		const matrix = this.transform.worldMatrix;
		context.transform(
			matrix[0], matrix[1],
			matrix[3], matrix[4],
			offset.x + matrix[6] * 100, offset.y + matrix[7] * 100,
		);
		if (this.font != null) {
			context.font = this.font;
		}
		context.fillStyle = this.color.rgbaString();
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		if (this.maxWidth != null) {
			context.fillText(this.text, 0, 0, this.maxWidth);
		} else {
			context.fillText(this.text, 0, 0);
		}
		context.restore();
	}
}
