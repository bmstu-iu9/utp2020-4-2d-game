import Component from './Component.js';
import Transform from './Transform.js';

export default class TransformComponent extends Component {
	constructor() {
		if (new.target === TransformComponent) {
			throw new TypeError('cannot create instance of abstract class.');
		}
		super();
		/**
		 * @type {Transform}
		 */
		this.transform = null;
	}

	destroy() {
		super.destroy();
		this.transform = null;
	}

	attach(componentObject) {
		super.attach(componentObject);
		if (!(componentObject.transform instanceof Transform)) {
			throw new Error('invalid "componentObject" transform. Expected an instance of Transform class.');
		}
		this.transform = componentObject.transform;
	}
}
