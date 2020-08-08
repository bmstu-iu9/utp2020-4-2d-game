import Sound from './Sound.js';
import GameComponent from '../GameComponent.js';

export default class AudioPlayer extends GameComponent {
	/**
	 * 
	 * @param {number}  volume       Громкость аудио от 0.0 до 1.0.
	 * @param {number}  playbackRate Скорость воспроизведения аудио от 0.0 до 2.0.
	 * @param {boolean} loop         Надо ли заново воспроизводить звук после завершения аудио.
	 */
	constructor(volume, playbackRate, loop, sound) {
		super();
		if (typeof volume !== 'number') {
			throw new TypeError('invalid parameter "volume". Expected a number.');
		}
		if (volume < 0 || volume > 1) {
			throw new RangeError('invalid value "volume". Expected a number between 0 and 1.');
		}
		if (typeof playbackRate !== 'number') {
			throw new TypeError('invalid parameter "playbackRate". Expected a number.');
		}
		if (playbackRate < 0 || playbackRate > 2) {
			throw new RangeError('invalid value "playbackRate". Expected a number between 0 and 2.');
		}
		if (typeof loop !== 'boolean') {
			throw new TypeError('invalid parameter "loop". Expected a boolean value.');
		}
		if (!(sound instanceof Sound)) {
			throw new TypeError('invalid parameter "sound". Expected an instance of Sound class.');
		}
		this.playbackRate = playbackRate;
		this.loop = loop;
		this.sound = sound;
		/**
		 * @type {AudioContext}
		 */
		this.context = new (window.AudioContext || window.webkitAudioContext)();
		this.gainNode = this.context.createGain();
		this.gainNode.gain.value = volume;
		this.gainNode.gain;
		this.gainNode.connect(this.context.destination);
	}

	onInitialize() {
		if (this.sound != null) {
			this.play(this.sound);
		}
	}

	/**
	 * Начинает воспроизведение звука.
	 * 
	 * @param {Sound} sound Звук, который надо воспроизвести.
	 */
	play(sound) {
		const node = sound.createSourceNode(this.context);
		node.playbackRate.value = this.playbackRate;
		node.loop = this.loop;
		node.connect(this.gainNode);
		node.start();
	}
}