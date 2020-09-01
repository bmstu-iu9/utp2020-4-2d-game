import Sound from './sounds/Sound.js';
import Texture from './graphics/webgl/Texture.js';
import Shader from './graphics/webgl/Shader.js';
import SpriteSheet from './graphics/SpriteSheet.js';
import Rect from './graphics/Rect.js';

const copyPixels = (imageData, scrX, scrY, scrW, scrH, destData, destX, destY) => {
	for (let curScrY = 0; curScrY < scrH; curScrY++) {
		for (let curScrX = 0; curScrX < scrW; curScrX++) {
			const curDestX = destX + curScrX;
			const curDestY = destY + curScrY;
			const curImageIndex = ((curScrX + scrX) + (curScrY + scrY) * imageData.width) * 4;
			const curDestIndex = (curDestX + curDestY * destData.width) * 4;
			for (let i = 0; i < 4; i++) {
				destData.data[curDestIndex + i] = imageData.data[curImageIndex + i];
			}
		}
	}
}

const copyPixelToRect = (imageData, scrX, scrY, destData, destX, destY, destW, destH) => {
	const curImageIndex = (scrX + scrY * imageData.width) * 4;
	for (let curDestY = destY; curDestY < destH + destY; curDestY++) {
		for (let curDestX = destX; curDestX < destW + destX; curDestX++) {
			const curDestIndex = (curDestX + curDestY * destData.width) * 4;
			for (let i = 0; i < 4; i++) {
				destData.data[curDestIndex + i] = imageData.data[curImageIndex + i];
			}
		}
	}
}

export default class Resources {
	constructor() {
		this.objectsToDestroy = new Set();

		this.imageLoadQueue = {};
		this.textureLoadQueue = {};
		this.textureCreationQueue = {};
		this.soundLoadQueue = {};
		this.textLoadQueue = {};
		this.shaderLoadQueue = {};
		this.tileMapSpriteSheetsLoadQueue = {};
		
		this.loadedImages = {};
		this.textures = {};
		this.loadedSounds = {};
		this.loadedTexts = {};
		this.loadedShaders = {};
		this.tileMapSpriteSheets = {};
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
	 * Загружает изображение и делает из него текстуру.
	 * 
	 * @param {string} id            ID по которому можно будет получить текстуру после ее создания.
	 * @param {string} path          Путь к изображению, которое будет использоваться в текстуре.
	 * @param {number} pixelsPerUnit Количество пикселей текстуры на одну условную единицу камеры.
	 * @param {boolean} isPixelImage Если указано true, то для масштабирования текстуры используется алгоритм NEAREST, иначе LINEAR.
	 */
	addTextureInLoadQueue(id, path, pixelsPerUnit = 100, isPixelImage = true) {
		this.throwIfDestroyed();
		if (typeof id !== 'string') {
			throw new TypeError('invalid parameter "id". Expected a string.');
		}

		if (id.trim() === '') {
			throw new TypeError('invalid parameter "id". Expected a non-empty string.');
		}

		if (this.textureLoadQueue[id] != null) {
			throw new Error(`texture with id "${id}" is already in the queue.`);
		}

		if (this.textureCreationQueue[id] != null) {
			throw new Error(`texture with id "${id}" is already in the queue.`);
		}

		if (this.textures[id] != null) {
			throw new Error(`texture with id "${id}" is already loaded.`);
		}

		if (typeof path !== 'string') {
			throw new TypeError('invalid parameter "path". Expected a string.');
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

		this.textureLoadQueue[id] = {path, pixelsPerUnit, isPixelImage};
	}

	/**
	 * Создает текстуру после загрузки всех изображений.
	 * 
	 * @param {string}  id            ID по которому можно будет получить текстуру после ее создания.
	 * @param {string}  imageId       ID изображения, из которого надо сделать текстуру.
	 * @param {number}  pixelsPerUnit Количество пикселей текстуры на одну условную единицу камеры.
	 * @param {boolean} isPixelImage  Если указано true, то для масштабирования текстуры используется алгоритм NEAREST, иначе LINEAR.
	 */
	createTextureAfterLoad(id, imageId, pixelsPerUnit = 100, isPixelImage = true) {
		this.throwIfDestroyed();
		if (typeof id !== 'string') {
			throw new TypeError('invalid parameter "id". Expected a string.');
		}

		if (id.trim() === '') {
			throw new TypeError('invalid parameter "id". Expected a non-empty string.');
		}

		if (this.textureLoadQueue[id] != null) {
			throw new Error(`texture with id "${id}" is already in the queue.`);
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

	createTileMapSpriteSheet({
		 id,
		 path,
		 border = 1,
		 tiles,
		 pixelsPerUnit = 100,
		 isPixelImage = true,
	 }) {
		if (typeof id !== 'string') {
			throw new TypeError('invalid parameter "id". Expected a string.');
		}

		if (id.trim() === '') {
			throw new TypeError('invalid parameter "id". Expected a non-empty string.');
		}

		if (this.tileMapSpriteSheetsLoadQueue[id] != null) {
			throw new Error(`tile map sprite sheet with id "${id}" is already in the queue.`);
		}

		if (this.tileMapSpriteSheets[id] != null) {
			throw new Error(`tile map sprite sheet with id "${id}" is already loaded.`);
		}

		if (typeof path !== 'string') {
			throw new TypeError('invalid parameter "path". Expected a string.');
		}

		if (!Number.isInteger(border) || border <= 0) {
			throw new Error('invalid parameter "border". Value must be greater than 0.');
		}

		tiles.forEach(tile => {
			if (!Array.isArray(tile)) {
				throw new TypeError('invalid tile. Expected an array.');
			}

			if (tile.length !== 2) {
				throw new Error('invalid tile. Expected an array with sprite name and region.');
			}

			const [name, region] = tile;
			if (typeof name !== 'string') {
				throw new TypeError('invalid tile name. Expected a string.');
			}

			if (name.trim() === '') {
				throw new TypeError('invalid tile name. Expected a non-empty string.');
			}

			if (!(region instanceof Rect)) {
				throw new TypeError('invalid tile region. Expected an instance of Rect class.');
			}
		});

		this.tileMapSpriteSheetsLoadQueue[id] = {
			path,
			border,
			tiles,
			pixelsPerUnit,
			isPixelImage,
		};
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

		const texturesToLoad = Object.entries(this.textureLoadQueue);
		this.textLoadQueue = {};

		const sounds = Object.entries(this.soundLoadQueue);
		this.soundLoadQueue = {};

		const texts = Object.entries(this.textLoadQueue);
		this.textLoadQueue = {};

		const shaders = Object.entries(this.shaderLoadQueue);
		this.shaderLoadQueue = {};

		const tileMapSpriteSheets =  Object.entries(this.tileMapSpriteSheetsLoadQueue);
		this.tileMapSpriteSheetsLoadQueue = {};
		
		let count = images.length + sounds.length + texts.length + shaders.length;
		count += textures.length + texturesToLoad.length + tileMapSpriteSheets.length;
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

		texturesToLoad.forEach(([id, properties]) => {
			const image = new Image();
			image.onload = () => {
				count--;
				this.textures[id] = new Texture(
					this,
					image,
					properties.pixelsPerUnit,
					properties.isPixelImage,
				);
				if (count === 0 && onload != null) {
					onload();
				}
			}

			image.onerror = () => {
				throw new Error(`cannot load texture with id "${id}" from "${properties.path}".`);
			}

			image.src = properties.path;
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

		tileMapSpriteSheets.forEach(([id, properties]) => {
			const image = new Image();
			image.onload = () => {
				count--;
				let tiles = [];
				const canvas = document.createElement('canvas');
				canvas.width = 4096;
				canvas.height = 4096;
				const context = canvas.getContext('2d');
				context.drawImage(image, 0, 0);
				const width = image.width;
				const height = image.height;
				let imageData = context.getImageData(0, 0, width, height);
				let maxWidth = 0;
				let maxHeight = 0;
				let deltaWidth = 0;
				let numberOfRows = 1;
				for (let tile of properties.tiles){
					let rect = tile[1];
					if (deltaWidth + rect.width + 2 * properties.border > 4096) {
						numberOfRows++;
						if (maxWidth < deltaWidth) {
							maxWidth = deltaWidth;
						}
						deltaWidth = 0;
					}

					deltaWidth += rect.width + 2 * properties.border;
					if (maxHeight < rect.height) {
						maxHeight = rect.height + 2 * properties.border;
					}
				}
				if ( maxWidth< deltaWidth) {
					maxWidth = deltaWidth;
				}

				maxHeight *= numberOfRows;
				const finalImageData = new ImageData(maxWidth, maxHeight);
				let destX = 0;
				let destY = 0;
				for (let i = 0; i < properties.tiles.length; i++) {
					let rect = properties.tiles[i][1];
					tiles[i] = [
						properties.tiles[i][0],
						new Rect(destX + properties.border, destY + properties.border, rect.width, rect.height),
					];
					copyPixels(
						imageData,
						rect.x,
						rect.y,
						rect.width,
						rect.height,
						finalImageData,
						destX + properties.border,
						destY + properties.border,
					);
					for (let i = 0; i < properties.border; i++) {
						copyPixels(
							imageData,
							rect.x,
							rect.y,
							rect.width,
							1,
							finalImageData,
							destX + properties.border,
							destY + i,
						);
						copyPixels(
							imageData,
							rect.x,
							rect.y + rect.height -1,
							rect.width,
							1,
							finalImageData,
							destX + properties.border,
							destY + properties.border + rect.height + (properties.border - i - 1),
						);
						copyPixels(
							imageData,
							rect.x,
							rect.y,
							1,
							rect.height,
							finalImageData,
							destX + i,
							destY + properties.border,
						);
						copyPixels(
							imageData,
							rect.x + rect.width - 1,
							rect.y,
							1,
							rect.height,
							finalImageData,
							destX + properties.border + rect.width + (properties.border - i - 1),
							destY + properties.border,
						);
						copyPixelToRect(
							imageData,
							rect.x,
							rect.y,
							finalImageData,
							destX,
							destY,
							properties.border,
							properties.border,
						);
						copyPixelToRect(
							imageData,
							rect.x + rect.width - 1,
							rect.y,
							finalImageData,
							destX + properties.border + rect.width,
							destY,
							properties.border,
							properties.border,
						);
						copyPixelToRect(
							imageData,
							rect.x,
							rect.y + rect.height - 1,
							finalImageData,
							destX,
							destY + properties.border + rect.height,
							properties.border, properties.border,
						);
						copyPixelToRect(
							imageData,
							rect.x + rect.width - 1,
							rect.y + rect.height - 1,
							finalImageData,
							destX + properties.border + rect.width,
							destY + properties.border + rect.height,
							properties.border,
							properties.border,
						);
					}

					if (destX + rect.width + 2 * properties.border > 4096) {
						destX = 0;
						destY += maxHeight / numberOfRows + 2 * properties.border;
					}

					destX += rect.width + 2 * properties.border;
				}

				const texture = new Texture(this, finalImageData, properties.pixelsPerUnit, properties.isPixelImage);
				const spriteSheet = new SpriteSheet(texture, ...tiles);
				this.tileMapSpriteSheets[id] = spriteSheet;
				if (count === 0 && onload != null) {
					onload();
				}
			}

			image.onerror = () => {
				throw new Error(`cannot create sprite sheet with id "${id}" from "${properties.path}".`);
			}

			image.src = properties.path;
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
	 * @return {Text} Возвращает загруженный текст по переданному id.
	 */
	getText(id) {
		this.throwIfDestroyed();
		return this.loadedTexts[id];
	}

	/**
	 * @param {string} id ID текстуры.
	 * 
	 * @return {Texture} Возвращает текстуру по переданному id.
	 */
	getTexture(id) {
		this.throwIfDestroyed();
		return this.textures[id];
	}

	/**
	 * @param {string} id ID шейдера.
	 * 
	 * @return {Shader} Возвращает шейдер по переданному id.
	 */
	getShader(id) {
		this.throwIfDestroyed();
		return this.loadedShaders[id];
	}

	getTiles(id) {
		this.throwIfDestroyed();
		return this.tileMapSpriteSheets[id];
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
