import Sound from './sounds/Sound.js';
import Texture from './graphics/webgl/Texture.js';
import Scene from './Scene.js';
import Shader from './graphics/webgl/Shader.js';

export default class Resources {
	constructor() {
		this.objectsToDestroy = new Set();

		this.imageLoadQueue = {};
		this.textureCreationQueue = {};
		this.soundLoadQueue = {};
		this.textLoadQueue = {};
		this.shaderLoadQueue = {};
		
		this.loadedImages = {};
		this.textures = {};
		this.loadedSounds = {};
		this.loadedTexts = {};
		this.loadedShaders = {};
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
	 * Добавляет шейдер в очередь загрузки.
	 * 
	 * @param {string} id   ID по которому можно будет получить шейдер после загрузки.
	 * @param {string} path Путь к текстовому файлу, в котором содержится код шейдера.
	 */
	addShaderInLoadQueue(id, path) {
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

		if (this.shaderLoadQueue[id] != null) {
			throw new Error(`shader with id "${id}" is already in the queue.`);
		}

		if (this.loadedShaders[id] != null) {
			throw new Error(`shader with id "${id}" is already loaded.`);
		}

		this.shaderLoadQueue[id] = path;
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

		const images = Object.entries(this.imageLoadQueue);
		this.imageLoadQueue = {};

		const textures = Object.entries(this.textureCreationQueue);
		this.textureCreationQueue = {};

		const sounds = Object.entries(this.soundLoadQueue);
		this.soundLoadQueue = {};

		const texts = Object.entries(this.textLoadQueue);
		this.textLoadQueue = {};

		const shaders = Object.entries(this.shaderLoadQueue);
		this.shaderLoadQueue = {};
		
		let count = images.length + textures.length + sounds.length + texts.length + shaders.length;
		if (count === 0) {
			if (onload != null) {
				onload();
			}
			return;
		}

		let imageCount = images.length;
		images.forEach(([id, path]) => {
			const image = new Image();
			image.onload = () => {
				count--;
				imageCount--;
				this.loadedImages[id] = image;
				if (imageCount === 0) {
					if (textures.length !== 0) {
						textures.forEach(([id, properties]) => {
							if (this.loadedImages[properties.imageId] == null) {
								throw new Error(`cannot create texture with id "${id}". Reason: image with id "${properties.imageId}" was not found.`);
							}

							count--;
							this.textures[id] = new Texture(
								this,
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

		sounds.forEach(([id, path]) => {
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

		texts.forEach(([id, path]) => {
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

		shaders.forEach(([id, path]) => {
			fetch(path)
				.then(response => response.text())
				.then(text => {
					this.loadedShaders[id] = Shader.fromText(this, id, text);
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

	/**
	 * @param {string} id ID шейдера.
	 * 
	 * @return {Sound} Возвращает шейдер по переданному id.
	 */
	getShader(id) {
		this.throwIfDestroyed();
		return this.loadedShaders[id];
	}

	destroy() {
		this.throwIfDestroyed();

		this.objectsToDestroy.forEach(obj => obj.destroy());
		delete this.objectsToDestroy;

		delete this.imageLoadQueue;
		delete this.textureCreationQueue;
		delete this.soundLoadQueue;
		delete this.textLoadQueue;
		delete this.shaderLoadQueue;

		delete this.loadedImages;
		delete this.textures;
		delete this.loadedSounds;
		delete this.loadedTexts;
		delete this.loadedShaders;
		this.isDestroyed = true;
	}
}
