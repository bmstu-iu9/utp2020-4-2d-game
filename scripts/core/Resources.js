import Sound from './sounds/Sound.js';
import Texture from './graphics/webgl/Texture.js';
import Scene from './Scene.js';

export default class Resources {
	/**
	 * @param {Scene} scene Сцена, которая содержит данные ресурсы.
	 */
	constructor(scene) {
		if (!(scene instanceof Scene)) {
			throw new TypeError('invalid parameter "scene". Expected an instance of Scene class.');
		}

		this.scene = scene;
		this.imageLoadQueue = {};
		this.soundLoadQueue = {};
		this.textLoadQueue = {};
		this.textureCreationQueue = {};
		this.loadedImages = {};
		this.loadedSounds = {};
		this.loadedTexts = {};
		this.textures = {};
		/**
		 * @type {AudioContext}
		 */
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		this.isDestroyed = false;
	}

	throwIfDestroyed() {
		if (this.isDestroyed) {
			throw new Error('resources is destroyed.');
		}
	}

	/**
	 * Добавляет изображение в очередь загрузки.
	 * 
	 * @param {string} id   ID по которому можно будет получить изображение после загрузки.
	 * @param {string} path Путь к изображению.
	 */
	addImageInLoadQueue(id, path) {
		this.throwIfDestroyed();
		if (typeof id !== 'string') {
			throw new TypeError('invalid parameter "id". Expected a string.');
		}

		if (id.trim() === '') {
			throw new TypeError('invalid parameter "id". Expected a non-empty string.');
		}

		if (typeof path !== 'string') {
			throw new TypeError('invalid parameter "path". Expected a string.');
		}

		if (this.imageLoadQueue[id] != null) {
			throw new Error(`image with id "${id}" is already in the queue.`);
		}

		if (this.loadedImages[id] != null) {
			throw new Error(`image with id "${id}" is already loaded.`);
		}

		this.imageLoadQueue[id] = path;
	}

	/**
	 * Добавляет аудио в очередь загрузки.
	 * 
	 * @param {string} id   ID по которому можно будет получить аудио после загрузки.
	 * @param {string} path Путь к аудио.
	 */
	addSoundInLoadQueue(id, path) {
		this.throwIfDestroyed();
		if (typeof id !== 'string') {
			throw new TypeError('invalid parameter "id". Expected a string.');
		}

		if (id.trim() === '') {
			throw new TypeError('invalid parameter "id". Expected a non-empty string.');
		}

		if (typeof path !== 'string') {
			throw new TypeError('invalid parameter "path". Expected a string.');
		}

		if (this.soundLoadQueue[id] != null) {
			throw new Error(`sound with id "${id}" is already in the queue.`);
		}

		if (this.loadedSounds[id] != null) {
			throw new Error(`sound with id "${id}" is already loaded.`);
		}

		this.soundLoadQueue[id] = path;
	}

	/**
	 * Добавляет текст в очередь загрузки.
	 * 
	 * @param {string} id   ID по которому можно будет получить текст после загрузки.
	 * @param {string} path Путь к текстовому файлу.
	 */
	addTextInLoadQueue(id, path) {
		this.throwIfDestroyed();
		if (typeof id !== 'string') {
			throw new TypeError('invalid parameter "id". Expected a string.');
		}

		if (id.trim() === '') {
			throw new TypeError('invalid parameter "id". Expected a non-empty string.');
		}

		if (typeof path !== 'string') {
			throw new TypeError('invalid parameter "path". Expected a string.');
		}

		if (this.textLoadQueue[id] != null) {
			throw new Error(`text with id "${id}" is already in the queue.`);
		}

		if (this.loadedTexts[id] != null) {
			throw new Error(`text with id "${id}" is already loaded.`);
		}

		this.textLoadQueue[id] = path;
	}

	/**
	 * Создает текстуру после загрузки всех изображений.
	 * 
	 * @param {string} id            ID по которому можно будет получить текстуру после ее создания.
	 * @param {string} imageId       ID изображения, из которого надо сделать текстуру.
	 * @param {number} pixelsPerUnit Количество пикселей текстуры на одну условную единицу камеры.
	 */
	createTextureAfterLoad(id, imageId, pixelsPerUnit = 100, isPixelImage = true) {
		if (typeof id !== 'string') {
			throw new TypeError('invalid parameter "id". Expected a string.');
		}

		if (id.trim() === '') {
			throw new TypeError('invalid parameter "id". Expected a non-empty string.');
		}

		if (this.textureCreationQueue[id] != null) {
			throw new Error(`texture with id "${id}" is already in the queue.`);
		}

		if (this.textures[id] != null) {
			throw new Error(`texture with id "${id}" is already loaded.`);
		}

		if (typeof imageId !== 'string') {
			throw new TypeError('invalid parameter "imageId". Expected a string.');
		}

		if (imageId.trim() === '') {
			throw new TypeError('invalid parameter "imageId". Expected a non-empty string.');
		}

		if (typeof pixelsPerUnit !== 'number') {
			throw new TypeError('invalid parameter "pixelsPerUnit". Expected a number.');
		}

		if (pixelsPerUnit < 1) {
			throw new Error('invalid parameter "pixelsPerUnit". Value must be greater than 0.');
		}

		if (typeof isPixelImage !== 'boolean') {
			throw new TypeError('invalid parameter "isPixelImage". Expected a boolean value.');
		}

		this.textureCreationQueue[id] = {imageId, pixelsPerUnit, isPixelImage};
	}

	/**
	 * Загружает все ресурсы.
	 * 
	 * @param {function} onload Функция, которая выполнится в конце загрузки.
	 */
	loadAll(onload) {
		this.throwIfDestroyed();
		if (onload != null && typeof onload !== 'function') {
			throw new TypeError('invalid parameter "onload". Expected a function.');
		}

		const imageEntries = Object.entries(this.imageLoadQueue);
		this.imageLoadQueue = {};
		const soundEntries = Object.entries(this.soundLoadQueue);
		this.soundLoadQueue = {};
		const textEntries = Object.entries(this.textLoadQueue);
		this.textLoadQueue = {};
		const textureEntries = Object.entries(this.textureCreationQueue);
		this.textureCreationQueue = {};
		let count = imageEntries.length + soundEntries.length + textEntries.length + textureEntries.length;
		if (count === 0) {
			if (onload != null) {
				onload();
			}
			return;
		}

		let imageCount = imageEntries.length;
		imageEntries.forEach(([id, path]) => {
			const image = new Image();
			image.onload = () => {
				count--;
				imageCount--;
				this.loadedImages[id] = image;
				if (imageCount === 0) {
					if (textureEntries.length !== 0) {
						textureEntries.forEach(([id, properties]) => {
							if (this.loadedImages[properties.imageId] == null) {
								throw new Error(`cannot create texture with id "${id}". Reason: image with id "${properties.imageId}" was not found.`);
							}
				
							count--;
							this.textures[id] = new Texture(
								this.scene,
								this.loadedImages[properties.imageId],
								properties.pixelsPerUnit,
								properties.isPixelImage,
							);
							if (count === 0 && onload != null) {
								onload();
							}
						});
					} else if (count === 0 && onload != null) {
						onload();
					}
				}
			}

			image.onerror = () => {
				throw new Error(`cannot load image with id "${id}" from "${path}".`);
			}
			
			image.src = path;
		});

		soundEntries.forEach(([id, path]) => {
			fetch(path)
				.then(response => response.arrayBuffer())
				.then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
				.then(audioBuffer => {
					this.loadedSounds[id] = new Sound(audioBuffer);
					count--;
					if (count === 0 && onload != null) {
						onload();
					} 
				});
		});

		textEntries.forEach(([id, path]) => {
			fetch(path)
				.then(response => response.text())
				.then(text => {
					this.loadedTexts[id] = text;
					count--;
					if (count === 0 && onload != null) {
						onload();
					}
				});
		});
	}

	/**
	 * @param {string} id ID загруженного изображения.
	 * 
	 * @return {HTMLImageElement} Возвращает загруженное изображение по переданному id.
	 */
	getImage(id) {
		this.throwIfDestroyed();
		return this.loadedImages[id];
	}

	/**
	 * @param {string} id ID загруженного аудио.
	 * 
	 * @return {Sound} Возвращает загруженное аудио по переданному id.
	 */
	getSound(id) {
		this.throwIfDestroyed();
		return this.loadedSounds[id];
	}

	/**
	 * @param {string} id ID загруженного текста.
	 * 
	 * @return {Sound} Возвращает загруженный текст по переданному id.
	 */
	getText(id) {
		this.throwIfDestroyed();
		return this.loadedTexts[id];
	}

	/**
	 * @param {string} id ID текстуры.
	 * 
	 * @return {Sound} Возвращает текстуру по переданному id.
	 */
	getTexture(id) {
		this.throwIfDestroyed();
		return this.textures[id];
	}

	destroy() {
		this.throwIfDestroyed();
		delete this.imageLoadQueue;
		delete this.soundLoadQueue;
		delete this.textLoadQueue;
		delete this.textureCreationQueue;
		delete this.loadedImages;
		delete this.loadedSounds;
		delete this.loadedTexts;
		delete this.textures;
		this.isDestroyed = true;
	}
}
