import HierarchyObject from '../HierarchyObject.js';

const uiHost = document.getElementById('uiHost');

export default class UIObject extends HierarchyObject {
	/**
	 * @param {object}      settings            Настройки объекта интерфейса.
	 * @param {string}      settings.name       Название объекта интерфейса.
	 * @param {boolean}     settings.isEnabled  Влючен ли объект интерфейса.
	 * @param {Component[]} settings.components Компоненты объекта интерфейса.
	 * @param {UIObject[]}  settings.children   Дочерние объекты интерфейса создаваемоего объекта интерфейса.
	 * @param {string}      setting.tag         Тег html-элемента.
	 * @param {string}      setting.className   Класс html-элемента.
	 * @param {string}      setting.id          ID html-элемента. 
	 * @param {string}      setting.cssText     Стиль html-элемента.
	 * @param {string}      setting.innerHTML   HTML-код, который будет внутри данного html-элемента. 
	 * @param {string}      setting.innerText   Текст, который будет внутри данного html-элемента.
	 */
	constructor({
		name,
		tag,
		className,
		id,
		cssText = '',
		innerHTML,
		innerText,
		isEnabled = true,
		components = [],
		children = [],
	}) {
		super(isEnabled);
		if (typeof tag !== 'string') {
			throw new TypeError('invalid parameter "tag". Expected a string.');
		}
		if (tag.trim() === '') {
			throw new Error('invalid parameter "tag". Expected a non-empty string.');
		}
		if (typeof name !== 'string') {
			throw new TypeError('invalid parameter "name". Expected a string.');
		}
		if (name.trim() === '') {
			throw new Error('invalid parameter "name". Expected a non-empty string.');
		}
		if (typeof cssText !== 'string') {
			throw new TypeError('invalid parameter "cssText". Expected a string.');
		}
		if (className != null && typeof className !== 'string') {
			throw new TypeError('invalid parameter "className". Expected a string.');
		}
		if (id != null && typeof id !== 'string') {
			throw new TypeError('invalid parameter "id". Expected a string.');
		}
		if (!Array.isArray(components)) {
			throw new TypeError('invalid parameter "components". Expected an array.');
		}
		if (!Array.isArray(children)) {
			throw new TypeError('invalid parameter "children". Expected an array.');
		}
		this.htmlObject = document.createElement(tag);
		if (className != null) {
			this.htmlObject.className = className;
		}
		if (id != null) {
			this.htmlObject.id = id;
		}
		this.name = name;
		this.htmlObject.style.cssText = cssText;
		this.unprocessedEvents = [];
		this.eventHandlers = new Map();
		this.availableEvents = new Set();
		for (let property in this.htmlObject) {
			if (property.substring(0, 2) === 'on') {
				this.availableEvents.add(property.substring(2, property.length));
			}
		}
		children.forEach(child => this.addChild(child));
		if (innerHTML != null) {
			this.setInnerHTML(innerHTML);
		} else if (innerText != null) {
			this.setInnerText(innerText);
		}
	}

	/**
	 * Устанавливает родителя для данного объкта интерфейса.
	 * Можно передать null, чтобы сделать его независимым.
	 * 
	 * @param {UIObject} uiObject Родительский объект интерфейса. Может быть null.
	 */
	setParent(uiObject) {
		if (uiObject == null) {
			super.setParent(null);
			return;
		}
		if (!(uiObject instanceof UIObject)) {
			throw new TypeError('invalid parameter "uiObject". Expected an instance of UIObject class.');
		}
		if (uiObject.isDestroyed) {
			return;
		}
		super.setParent(uiObject);
	}

	/**
	 * Добавляет дочерний объект интерфейса.
	 * 
	 * @param {UIObject} uiObject Объект интерфейса, который станет дочерним.
	 * 
	 * @return {boolean} Возвращает true, если объект интерфейса стал дочерним.
	 */
	addChild(uiObject) {
		if (!(uiObject instanceof UIObject)) {
			throw new TypeError('invalid parameter "uiObject". Expected an instance of UIObject class.');
		}
		if (uiObject.isDestroyed) {
			return;
		}
		if (this.children.size === 0 && this.htmlObject.innerHTML !== '') {
			throw new Error('cannot add child when already exist innerHTML.');
		}
		if (super.addChild(uiObject)) {
			this.htmlObject.appendChild(uiObject.htmlObject);
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Удаляет дочерний объект интерфейса из данного объекта интерфейса.
	 * 
	 * @param {UIObject} child Дочерний объект интерфейса.
	 * 
	 * @return {boolean} Возвращает true, если дочерний объект интерфейса был удален.
	 */
	removeChild(child) {
		if (super.removeChild(child)) {
			this.htmlObject.removeChild(child.htmlObject);
			return true;
		} else {
			return false;
		}
	}

	handleEvent(event) {
		if (event.defaultPrevented) {
			return;
		}
		this.unprocessedEvents.push(event);
	}

	initialize() {
		super.initialize();
		if (this.parent == null) {
			uiHost.appendChild(this.htmlObject);
		}
	}

	process() {
		this.unprocessedEvents.forEach(event => {
			this.eventHandlers.get(event.type).forEach(handler => {
				handler(event);
			});
		});
		this.unprocessedEvents = [];
	}

	/**
	 * Служебная функция. Для включения и выключения объекта использовать setEnabled(value).
	 * 
	 * @access protected
	 */
	enable() {
		super.enable();
		if (this.isActive()) {
			this.htmlObject.style.display = 'block';
		} else {
			this.htmlObject.style.display = 'none';
		}
	}

	/**
	 * Служебная функция. Для включения и выключения объекта использовать setEnabled(value).
	 * 
	 * @access protected
	 */
	disable() {
		super.disable();
		if (this.isActive()) {
			this.htmlObject.style.display = 'block';
		} else {
			this.htmlObject.style.display = 'none';
		}
	}

	/**
	 * Добавляет обработчик событий на html-элемент.
	 * 
	 * @param {string}                 type    Название события.
	 * @param {(event: Event) => void} handler Обработчик события.
	 */
	addEventListener(type, handler) {
		if (typeof type !== 'string') {
			throw new TypeError('invalid parameter "type". Expected a string.');
		}
		if (typeof handler !== 'function') {
			throw new TypeError('invalid parameter "handler". Expected a function.');
		}
		if (!this.availableEvents.has(type)) {
			throw new Error(`invalid parameter "type". Tag "${this.htmlObject.tagName}" is not support event type "${type}".`);
		}
		if (this.eventHandlers.has(type)) {
			this.eventHandlers.get(type).add(handler);
		} else {
			this.eventHandlers.set(type, new Set());
			this.eventHandlers.get(type).add(handler);
			this.htmlObject.addEventListener(type, this.handleEvent);
		}
	}

	/**
	 * Добавляет html-код, который будет внутри данного html-элемента.
	 * 
	 * @param {string} html HTML-код, который будет внутри данного html-элемента.
	 */
	setInnerHTML(html) {
		if (typeof html !== 'string') {
			throw new TypeError('invalid parameter "html". Expected a string.');
		}
		if (this.children.size !== 0) {
			throw new Error(`this "${this.name}" already has child html element.`);
		} else {
			this.htmlObject.innerHTML = html;
		}
	}

	/**
	 * Добавляет текст, который будет внутри данного html-элемента.
	 * 
	 * @param {string} text Текст, который будет внутри данного html-элемента.
	 */
	setInnerText(text) {
		if (typeof text !== 'string') {
			throw new TypeError('invalid parameter "text". Expected a string.');
		}
		if (this.children.size !== 0) {
			throw new Error(`this "${this.name}" already has child html element.`);
		} else {
			this.htmlObject.innerText = text;
		}
	}
}
