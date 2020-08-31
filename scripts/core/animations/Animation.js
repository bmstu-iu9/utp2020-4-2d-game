import KeyFrame from './KeyFrame.js';

export default class Animation {
	/**
	 * @param {number}   time      Время, когда активируется кадр.
	 * @param {boolean}  loop      Надо ли перезапускать анимацию после её завершения.
	 * @param {KeyFrame} keyFrames Ключевые кадры анимации.
	 */
	constructor(time, loop, keyFrames) {
		if (typeof time !== 'number') {
			throw new TypeError('invalid parameter "time". Expected a number.');
		}
		if (typeof loop !== 'boolean') {
			throw new TypeError('invalid parameter "loop". Expected a boolean value.');
		}
		if (!Array.isArray(keyFrames)) {
			throw new TypeError('invalid parameter "keyFrames". Expected an array.');
		}
		if (keyFrames.length === 0) {
			throw new Error('invalid parameter "keyFrames". Expected a non-empty array.');
		}
		keyFrames.forEach(keyFrame => {
			if (!(keyFrame instanceof KeyFrame)) {
				throw new TypeError('invalid array\'s element. Expected an instance of KeyFrame class.');
			}
		});
		this.time = time;
		this.loop = loop;
		this.keyFrames = keyFrames;
		this.keyFrames.sort((a, b) => a.time - b.time);
	}
}