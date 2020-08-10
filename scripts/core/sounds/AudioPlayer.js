import Sound from './Sound.js';
import GameComponent from '../GameComponent.js';

export default class AudioPlayer extends GameComponent {
	/**
	 * @param {object}  settings                  Настройки аудио плеера.
	 * @param {number}  settings.volume           Громкость аудио от 0.0 до 1.0.
	 * @param {number}  settings.playbackRate     Скорость воспроизведения аудио от 0.0 до 2.0.
	 * @param {boolean} settings.loop             Надо ли заново воспроизводить звук после завершения аудио.
	 * @param {Sound}   settings.sound            Аудио, которое надо воспроизвести.
	 * @param {boolean} settings.playOnInitialize Воспроизводить ли звук при инициализации.
	 */
	constructor({volume, playbackRate, loop, sound, playOnInitialize, isSpatialSound}) {
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
		if (typeof isSpatialSound !== 'boolean') {
			throw new TypeError('invalid parameter "isSpatialSound". Expected a boolean value.');
		}
		if (typeof playOnInitialize !== 'boolean') {
			throw new TypeError('invalid parameter "playOnInitialize". Expected a boolean value.');
		}
		if (!(sound instanceof Sound)) {
			throw new TypeError('invalid parameter "sound". Expected an instance of Sound class.');
		}
		this.playbackRate = playbackRate;
		this.loop = loop;
		this.volume = volume;
		this.playOnInitialize = playOnInitialize;
		this.isSpatialSound = isSpatialSound;
		/**
		 * @type {AudioContext}
		 */
		this.context = new (window.AudioContext || window.webkitAudioContext)();
		this.gainNode = this.context.createGain();
		this.gainNode.gain.value = volume;
		this.gainNode.gain;
		this.gainNode.connect(this.context.destination);
		/**
		 * @type {Sound}
		 */
		this.sound = null;
		/**
		 * @type {AudioBufferSourceNode}
		 */
		this.currentNode = null;
		this.setSound(sound);
	}

	onInitialize() {
		if (this.sound != null && this.playOnInitialize) {
			this.currentNode.start();
		}
	}

	onEnable() {
		this.context.resume();
	}

	onDisable() {
		this.context.suspend();
	}

	onUpdate() {
		const camera = this.gameObject.scene.camera;
		if (this.isSpatialSound && camera != null && camera.isActive()) {
			const distance = camera.transform.position.subtract(this.transform.position).length();
			console.log(distance);
			if (distance > 20) {
				this.gainNode.gain.value = 0;
			} else {
				const k = (20 - distance) / 20;
				this.gainNode.gain.value = this.volume * k;
			}
		}
	}

	/**
	 * Начинает воспроизведение звука.
	 */
	play() {
		if (!this.isInitialized) {
			this.playOnInitialize = true;
			return;
		}
		if (!this.isActive()) {
			return;
		}
		if (this.sound == null) {
			return;
		}
		this.currentNode.start();
	}

	/**
	 * Меняет аудио.
	 * 
	 * @param {Sound} sound Аудио.
	 */
	setSound(sound) {
		if (!(sound instanceof Sound)) {
			throw new TypeError('invalid parameter "sound". Expected an instance of Sound class.');
		}
		if (this.sound != null) {
			this.currentNode.stop();
			this.currentNode.disconnect();
			this.currentNode = null;
		}
		this.sound = sound;
		this.currentNode = this.sound.createSourceNode(this.context);
		this.currentNode.playbackRate.value = this.playbackRate;
		this.currentNode.loop = this.loop;
		this.currentNode.connect(this.gainNode);
	}

	/**
	 * Изменяет громкость звука общего выходного потока аудио.
	 * 
	 * @param {number} volume Громкость звука от 0.0 до 1.0.
	 */
	setVolume(volume) {
		if (typeof volume !== 'number') {
			throw new TypeError('invalid parameter "volume". Expected a number.');
		}
		if (volume < 0 || volume > 1) {
			throw new RangeError('invalid value "volume". Expected a number between 0 and 1.');
		}
		this.volume = volume;
		this.gainNode.gain.value = volume;
	}

	/**
	 * Изменяет скорость воспроизведения звука аудио.
	 * 
	 * @param {number} playbackRate Скорость аудио.
	 */
	setPlayBackRate(playbackRate) {
		if (typeof playbackRate !== 'number') {
			throw new TypeError('invalid parameter "playbackRate". Expected a number.');
		}
		if (playbackRate < 0 || playbackRate > 2) {
			throw new RangeError('invalid value "playbackRate". Expected a number between 0 and 2.');
		}
		this.playbackRate = playbackRate;
		if (this.currentNode == null) {
			return;
		}
		this.currentNode.playbackRate.value = playbackRate;
	}

	/**
	 * Надо ли заново воспроизводить звук после завершения аудио.
	 * 
	 * @param {boolean} loop Повтор аудио.
	 */
	setLoop(loop) {
		if (typeof loop !== 'boolean') {
			throw new TypeError('invalid parameter "loop". Expected a boolean value.');
		}
		this.loop = loop;
		if (this.currentNode == null) {
			return;
		}
		this.currentNode.loop = loop;
	}

	/**
	 * Останавливает аудио.
	 */
	stop() {
		if (!this.isInitialized) {
			this.playOnInitialize = false;
			return;
		}
		if (!this.isActive()) {
			return;
		}
		if (this.currentNode == null) {
			return;
		}
		this.currentNode.stop();
	}
}
