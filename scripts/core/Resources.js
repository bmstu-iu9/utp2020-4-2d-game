export default class Resources {
	constructor() {
		this.imageLoadQueue = {};
		this.loadedImages = {};
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
	 * Загружает все ресурсы.
	 * 
	 * @param {function} onload Функция, которая выполнится в конце загрузки.
	 */
	loadAll(onload) {
		this.throwIfDestroyed();
		if (onload != null && typeof onload !== 'function') {
			throw new TypeError('invalid parameter "onload". Expected a function.');
		}
		const entries = Object.entries(this.imageLoadQueue);
		let count = entries.length;
		entries.forEach(([id, path]) => {
			const image = new Image();
			image.onload = () => {
				count--;
				this.loadedImages[id] = image;
				if (count == 0 && onload != null) {
					onload();
				}
			}
			image.onerror = () => {
				throw new Error(`cannot load image with id "${id}" from "${path}".`);
			}
			image.src = path;
		});
		this.imageLoadQueue = {};
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

	destroy() {
		this.throwIfDestroyed();
		delete this.imageLoadQueue;
		delete this.loadedImages;
		this.isDestroyed = true;
	}
}
