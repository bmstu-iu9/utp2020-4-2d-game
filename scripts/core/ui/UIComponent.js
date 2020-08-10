import Component from '../Component.js';
import UIObject from './UIObject.js';

export default class UIComponent extends Component {
	constructor() {
		if (new.target === UIComponent) {
			throw new TypeError('cannot create instance of abstract class.');
		}
		super();
		/**
		 * @type {UIObject}
		 */
		this.uiObject = null;
	}

	destroy() {
		super.destroy();
		this.uiObject = null;
	}

	attach(uiObject) {
		super.attach(uiObject);
		if (!(uiObject instanceof UIObject)) {
			throw new TypeError('invalid parameter "uiObject". Expected an instance of UIObject class.');
		}
		this.uiObject = uiObject;
	}
}
