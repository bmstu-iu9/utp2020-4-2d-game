import Vector2d from './Vector2d.js';
import Screen from './Screen.js';

export default class Input {
	static keysDown = new Set();
	/**
	 * @access private
	 */
	static pressedKeys = new Set();
	/**
	 * @access private
	 */
	static keysUp = new Set();
	/**
	 * @access private
	 */
	static unprocessedKeysDown = new Set();
	/**
	 * @access private
	 */
	static unprocessedKeysUp = new Set();

	static mousePosition = Vector2d.zero;
	/**
	 * @access private
	 */
	static unprocessedMousePosition = null;
	/**
	 * @access private
	 */
	static mouseButtonsDown = new Set();
	/**
	 * @access private
	 */
	static mousePressedButtons = new Set();
	/**
	 * @access private
	 */
	static mouseButtonsUp = new Set();
	/**
	 * @access private
	 */
	static unprocessedMouseButtonsDown = new Set();
	/**
	 * @access private
	 */
	static unprocessedMouseButtonsUp = new Set();

	/**
	 * @access private
	 */
	static handleKeyDown(event) {
		if (event.defaultPrevented) {
			return;
		}
		Input.unprocessedKeysDown.add(event.code.toUpperCase());
		event.preventDefault();
	}

	/**
	 * @access private
	 */
	static handleKeyUp(event) {
		if (event.defaultPrevented) {
			return;
		}
		Input.unprocessedKeysUp.add(event.code.toUpperCase());
		event.preventDefault();
	}

	/**
	 * @access private
	 */
	static handleBlur() {
		Input.keysDown.clear();
		Input.pressedKeys.clear();
		Input.keysUp.clear();
		Input.unprocessedKeysDown.clear();
		Input.unprocessedKeysUp.clear();
		Input.mouseButtonsDown.clear();
		Input.mouseButtonsUp.clear();
		Input.mousePressedButtons.clear();
		Input.unprocessedMouseButtonsDown.clear();
		Input.unprocessedMouseButtonsUp.clear();
	}

	/**
	 * @access private
	 */
	static handleMouseDown(event) {
		if (event.defaultPrevented) {
			return;
		}
		if (Screen.canvas == null) {
			Input.mousePosition = Vector2d.zero;
			return;
		}
		const x = event.pageX - Screen.canvas.offsetLeft;
		const y = event.pageY - Screen.canvas.offsetTop;
		if (x < 0 || x > Screen.canvas.clientWidth || y < 0 || y > Screen.canvas.clientHeight) {
			return;
		}
		Input.unprocessedMousePosition = new Vector2d(x, y);
		Input.unprocessedMouseButtonsDown.add(event.button);
		event.preventDefault();
	}

	/**
	 * @access private
	 */
	static handleMouseUp(event) {
		if (event.defaultPrevented) {
			return;
		}
		if (Screen.canvas == null) {
			Input.mousePosition = Vector2d.zero;
			return;
		}
		Input.unprocessedMouseButtonsUp.add(event.button);
		if (Input.mousePressedButtons.has(event.button)) {
			event.preventDefault();
		}
		const x = event.pageX - Screen.canvas.offsetLeft;
		const y = event.pageY - Screen.canvas.offsetTop;
		if (x < 0 || x > Screen.canvas.clientWidth || y < 0 || y > Screen.canvas.clientHeight) {
			return;
		}
		Input.unprocessedMousePosition = new Vector2d(x, y);
	}

	/**
	 * @access private
	 */
	static handleMouseMove(event) {
		if (event.defaultPrevented) {
			return;
		}
		if (Screen.canvas == null) {
			Input.mousePosition = Vector2d.zero;
			return;
		}
		const x = event.pageX - Screen.canvas.offsetLeft;
		const y = event.pageY - Screen.canvas.offsetTop;
		if (x < 0 || x > Screen.canvas.clientWidth || y < 0 || y > Screen.canvas.clientHeight) {
			return;
		}
		Input.unprocessedMousePosition = new Vector2d(x, y);
		event.preventDefault();
	}

	/**
	 * @access private
	 */
	static handleContextMenu(event) {
		if (event.defaultPrevented || Screen.canvas == null) {
			return;
		}
		if (Screen.getCanvasRect().contains(event.pageX, event.pageY)) {
			event.preventDefault();
		}
	}

	static initialize() {
		window.addEventListener('keydown', Input.handleKeyDown);
		window.addEventListener('keyup', Input.handleKeyUp);
		window.addEventListener('blur', Input.handleBlur);

		window.addEventListener('mousedown', Input.handleMouseDown);
		window.addEventListener('mousemove', Input.handleMouseMove);
		window.addEventListener('mouseup', Input.handleMouseUp);

		window.addEventListener('contextmenu', Input.handleContextMenu);
	}

	static destroy() {
		window.removeEventListener('keydown', Input.handleKeyDown);
		window.removeEventListener('keyup', Input.handleKeyUp);
		window.removeEventListener('blur', Input.handleBlur);

		window.removeEventListener('mousedown', Input.handleMouseDown);
		window.removeEventListener('mousemove', Input.handleMouseMove);
		window.removeEventListener('mouseup', Input.handleMouseUp);

		window.removeEventListener('contextmenu', Input.handleContextMenu);

		Input.keysDown.clear();
		Input.pressedKeys.clear();
		Input.keysUp.clear();
		Input.unprocessedKeysDown.clear();
		Input.unprocessedKeysUp.clear();

		Input.mouseButtonsDown.clear();
		Input.mousePressedButtons.clear();
		Input.mouseButtonsUp.clear();
		Input.mousePosition = Vector2d.zero;
		Input.unprocessedMouseButtonsDown.clear();
		Input.unprocessedMouseButtonsUp.clear();
		Input.unprocessedMousePosition = null;
	}

	static process() {
		Input.keysDown.clear();
		Input.keysUp.clear();
		Input.unprocessedKeysDown.forEach(key => {
			if (!Input.pressedKeys.has(key)) {
				Input.keysDown.add(key);
				Input.pressedKeys.add(key);
			}
		});
		Input.unprocessedKeysUp.forEach(key => {
			Input.keysUp.add(key);
			Input.pressedKeys.delete(key);
		});
		Input.unprocessedKeysDown.clear();
		Input.unprocessedKeysUp.clear();

		Input.mouseButtonsDown.clear();
		Input.mouseButtonsUp.clear();
		Input.unprocessedMouseButtonsDown.forEach(button => {
			if (!Input.mousePressedButtons.has(button)) {
				Input.mouseButtonsDown.add(button);
				Input.mousePressedButtons.add(button);
			}
		});
		Input.unprocessedMouseButtonsUp.forEach(button => {
			Input.mouseButtonsUp.add(button);
			Input.mousePressedButtons.delete(button);
		});
		Input.unprocessedMouseButtonsDown.clear();
		Input.unprocessedMouseButtonsUp.clear();
		if (Input.unprocessedMousePosition != null) {
			Input.mousePosition = Input.unprocessedMousePosition;
		}
		Input.unprocessedMousePosition = null;
	}

	/**
	 * @param {string} key Название клавиши.
	 * 
	 * @return {boolean} Возвращает true, если на клавишу нажали в текущем кадре.
	 */
	static getKeyDown(key) {
		if (typeof key !== 'string') {
			throw new TypeError('invalid parameter "key". Expected a string.');
		}
		return Input.keysDown.has(key.toUpperCase());
	}

	/**
	 * @param {string} key Название клавиши.
	 * 
	 * @return {boolean} Возвращает true, если клавиша нажата в текущем кадре.
	 */
	static getKeyPressed(key) {
		if (typeof key !== 'string') {
			throw new TypeError('invalid parameter "key". Expected a string.');
		}
		return Input.pressedKeys.has(key.toUpperCase());
	}

	/**
	 * @param {string} key Название клавиши.
	 *
	 * @return {boolean} Возвращает true, если клавишу отпустили в текущем кадре.
	 */
	static getKeyUp(key) {
		if (typeof key !== 'string') {
			throw new TypeError('invalid parameter "key". Expected a string.');
		}
		return Input.keysUp.has(key.toUpperCase());
	}

	/**
	 * @param {number} button Номер кнопки.
	 * 
	 * @return {boolean} Возвращает true, если на кнопку мыши нажали в текущем кадре.
	 */
	static getMouseButtonDown(button) {
		if (typeof button !== 'number') {
			throw new TypeError('invalid parameter "button". Expected a number.');
		}
		return Input.mouseButtonsDown.has(button);
	}

	/**
	 * @param {number} button Номер кнопки.
	 * 
	 * @return {boolean} Возвращает true, если на кнопка мыши нажата в текущем кадре.
	 */
	static getMouseButtonPressed(button) {
		if (typeof button !== 'number') {
			throw new TypeError('invalid parameter "button". Expected a number.');
		}
		return Input.mousePressedButtons.has(button);
	}

	/**
	 * @param {number} button Номер кнопки.
	 * 
	 * @return {boolean} Возвращает true, если на кнопку мыши отпустили в текущем кадре.
	 */
	static getMouseButtonUp(button) {
		if (typeof button !== 'number') {
			throw new TypeError('invalid parameter "button". Expected a number.');
		}
		return Input.mouseButtonsUp.has(button);
	}

	static mouseButton = Object.freeze({
		left: 0,
		middle: 1,
		right: 2,
		button1: 3,
		button2: 4,
	});
}
