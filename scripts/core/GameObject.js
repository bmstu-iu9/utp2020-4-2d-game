import Vector2d from './Vector2d.js';

export default class GameObject {
	/**
	 * @param {string}   name     Имя игрового объекта.
	 * @param {boolean}  isStatic Должен ли игровой объект быть статичным.
	 * @param {Vector2d} position Позиция игрового объекта.
	 * @param {number}   rotation Угол поворота игрового объекта в радианах.
	 * @param {Vector2d} scale    Масштаб игрового объекта.
	 */
	constructor(name, isStatic = false, position = Vector2d.zero, rotation = 0, scale = new Vector2d(1, 1)) {
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}
		if (name.trim() === '') {
			throw new Error('invalid parameter "name". Expected a non-empty string.');
		}
		if (typeof isStatic !== 'boolean') {
			throw new TypeError('invalid parameter "isStatic". Expected a boolean value.');
		}

		this.name = name;
		this.setPosition(position);
		this.setRotation(rotation);
		this.setScale(scale);
		this.isStatic = isStatic;
		/**
		 * @type {GameObject[]}
		 */
		this.children = [];
		/**
		 * @type {GameObject}
		 */
		this.parent = null;
		this.isInitialized = false;
	}

	/**
	 * Изменяет позицию игрового объекта.
	 * 
	 * @param {Vector2d} position Новая позиция игрового объекта. 
	 */
	setPosition(position) {
		if (this.isStatic) {
			throw new Error('attempt to modify a static gameobject.');
		}
		if (!(position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}
		this.position = position.copy();
	}

	/**
	 * Изменяет угол поворота игрового объекта.
	 * 
	 * @param {number} angle Новый угол поворота игрового объекта в радианах. 
	 */
	setRotation(angle) {
		if (this.isStatic) {
			throw new Error('attempt to modify a static gameobject.');
		}
		if (typeof angle !== 'number') {
			throw new TypeError('invalid parameter "angle". Expected a number.');
		}
		this.rotation = angle;
	}

	/**
	 * Изменяет масштаб игрового объекта.
	 * 
	 * @param {Vector2d} scale Новый масштаб игрового объекта. 
	 */
	setScale(scale) {
		if (this.isStatic) {
			throw new Error('attempt to modify a static gameobject.');
		}
		if (!(scale instanceof Vector2d)) {
			throw new TypeError('invalid parameter "scale". Expected an instance of Vector2d class.');
		}
		this.scale = scale.copy();
	}

	/**
	 * Устанавливает родителя для данного игрового объкта.
	 * Можно передать null, чтобы сделать его независимым. 
	 * 
	 * @param {GameObject} gameObject Родительский игровой объект. Может быть null.
	 */
	setParent(gameObject) {
		if (this.isStatic) {
			throw new Error('attempt to modify a static gameobject.');
		}
		if (gameObject == null) {
			if (this.parent != null) {
				this.parent.removeChild(this);
			}
			return;
		}
		if (!(gameObject instanceof GameObject)) {
			throw new TypeError('invalid parameter "gameObject". Expected an instance of GameObject class.');
		}
		gameObject.addChild(this);
	}

	/**
	 * Добавляет дочерний игровой объект.
	 * 
	 * @param {GameObject} gameObject Игровой объект, который станет дочерним. 
	 */
	addChild(gameObject) {
		if (!(gameObject instanceof GameObject)) {
			throw new TypeError('invalid parameter "gameObject". Expected an instance of GameObject class.');
		}
		if (this.getChildByName(gameObject.name) == null) {
			this.children.push(gameObject);
			if (gameObject.parent != null) {
				gameObject.parent.removeChild(gameObject);
			}
			gameObject.parent = this;
		}
	}

	/**
	 * @param {string} name Имя дочернего игрового объекта.
	 * 
	 * @return {GameObject} Возвращает дочерний игровой объект с переданным именем. Если он не нашелся, то возвращается undefined.
	 */
	getChildByName(name) {
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}
		return this.children.find(child => child.name === name);
	}

	/**
	 * @param {number} index Индекс дочернего игрового объекта.
	 * 
	 * @return {GameObject} Возвращает дочерний игровой объект по индексу.
	 */
	getChildByIndex(index) {
		if (!Number.isInteger(index)) {
			throw new TypeError('invalid parameter "index". Expected a integer.');
		}
		if (index < 0 || index >= this.children.length) {
			throw new RangeError('invalid parameter "index".');
		}
		return this.children[index];
	}

	/**
	 * Удаляет дочерний игровой объект из данного игрового объекта.
	 * 
	 * @param {GameObject} child Дочерний объект.
	 */
	removeChild(child) {
		const index = this.children.indexOf(child);
		if (index >= 0) {
			const [deleted] = this.children.splice(index, 1);
			deleted.parent = null;
		}
	}

	/**
	 * Удаляет дочерний игровой объект из данного игрового объекта по индексу.
	 * 
	 * @param {number} index Индекс дочернего объекта.
	 */
	removeChildAt(index) {
		if (!Number.isInteger(index)) {
			throw new TypeError('invalid parameter "index". Expected a integer.');
		}
		if (index < 0 || index >= this.children.length) {
			throw new RangeError('invalid parametr "index".');
		}
		const [deleted] = this.children.splice(index, 1);
		deleted.parent = null;
	}

	/**
	 * Инициализирует данный игровой объект.
	 */
	initialize() {
		if (this.isInitialized) {
			throw new Error('already initialized.');
		}
		this.isInitialized = true;
	}

	/**
	 * Вызывается во время каждого кадра.
	 * 
	 * @param {number} deltaTime Время, которое прошло с прошлого кадра в миллисекундах.
	 */
	onFrameUpdate(deltaTime) {
	}

	/**
	 * Вызывается во время каждого кадра в конце.
	 * 
	 * @param {number} deltaTime Время, которое прошло с прошлого кадра в миллисекундах.
	 */
	onFrameUpdateEnd(deltaTime) {
	}

	/**
	 * Отрисовывает данный игровой объект в передаваемом контексте.
	 * 
	 * @param {CanvasRenderingContext2D} context Контекст, в котором будет происходить отрисовка. 
	 */
	draw(context) {
	}

	/**
	 * Уничтожает данный игровой объект.
	 */
	destroy() {
	}
}