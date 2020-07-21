import Component from './Component.js';
import Transform from './Transform.js';

export default class TransformComponent extends Component {
	constructor() {
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
