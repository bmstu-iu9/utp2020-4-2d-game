export default class Color {
	/**
	 * @param {number} r Интенсивность красного цвета в диапазоне от 0 до 255.
	 * @param {number} g Интенсивность зеленого цвета в диапазоне от 0 до 255.
	 * @param {number} b Интенсивность синего цвета в диапазоне от 0 до 255.
	 * @param {number} a Прозрачность в диапазоне от 0 до 255.
	 */
	constructor(r, g, b, a = 255) {
		const assert = (x, name) => {
			if (typeof x !== 'number') {
				throw new TypeError(`invalid parameter "${name}". Expected a number.`);
			}
			if (x < 0 || x > 255) {
				throw new RangeError(`parameter "${name}" must be in range [0; 255].`);
			}
		}
		assert(r, 'r');
		assert(g, 'g');
		assert(b, 'b');
		assert(a, 'a');
		this.rgba = Object.freeze([r / 255, g / 255, b / 255, a / 255]);
	}

	/**
	 * @param {number} number Число, которое содержит в себе информацию о цвете.
	 * 
	 * @return {Color} Возвращает цвет, полученный из числа.
	 */
	static fromNumber(number) {
		if (typeof number !== 'number') {
			throw new TypeError('invalid parameter "number". Expected a number.');
		}
		const r = (number >> 24) & 0xFF;
		const g = (number >> 16) & 0xFF;
		const b = (number >> 8) & 0xFF;
		const a = number & 0xFF;
		return new Color(r, g, b, a);
	}

	/**
	 * @param {string} hex Цвет в hex записи.
	 * 
	 * @return {Color} Возвращает цвет, полученный из hex.
	 */
	static fromHex(hex) {
		if (typeof hex !== 'string') {
			throw new TypeError('invalid parameter "hex". Expected a string.');
		}
		hex = hex.trim();

		if (/^#([0-9a-fA-F]){3,4}$/.test(hex)) {
			hex = hex.substring(1).split('');
			if (hex.length === 3) {
				hex = [hex[0], hex[0], hex[1], hex[1], hex[2], hex[2], 'F', 'F'];
			} else {
				hex = [hex[0], hex[0], hex[1], hex[1], hex[2], hex[2], hex[3], hex[3]];
			}
			hex = hex.join('');
		} else if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
			hex = `${hex.substring(1)}FF`;
		} else if (/^#[0-9a-fA-F]{8}$/.test(hex)) {
			hex = hex.substring(1);
		} else {
			throw new Error('bad hex.');
		}

		return Color.fromNumber(Number(`0x${hex}`));
	}

	/**
	 * @return {string} Возвращает цвет в виде строки: "rgba(r, g, b, a)".
	 */
	rgbaString() {
		return `rgba(${this.rgba[0] * 255}, ${this.rgba[1] * 255}, ${this.rgba[2] * 255}, ${this.rgba[3] * 255})`;
	}

	/**
	 * @return {string} Возвращает цвет в виде строки: "rgb(r, g, b)".
	 */
	rgbString() {
		return `rgb(${this.rgba[0] * 255}, ${this.rgba[1] * 255}, ${this.rgba[2] * 255})`;
	}

	static white = Object.freeze(new Color(255, 255, 255));
	static black = Object.freeze(new Color(0, 0, 0));
	static transparent = Object.freeze(new Color(0, 0, 0, 0));
	static red = Object.freeze(new Color(255, 0, 0));
	static green = Object.freeze(new Color(0, 255, 0));
	static blue = Object.freeze(new Color(0, 0, 255));
}
