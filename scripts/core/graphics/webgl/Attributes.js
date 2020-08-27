import Attribute from './Attribute.js';

export default class Attributes {
	/**
	 * @param  {...{name: string, type: number}} attributes
	 */
	constructor(...attributes) {
		/**
		 * @type {Attribute[]}
		 */
		this.storage = [];
		let offset = 0;
		this.stride = 0;
		for (let attribute of attributes) {
			if (typeof attribute !== 'object') {
				throw new TypeError('invalid attribute. Expected an object.');
			}

			if (typeof attribute.name !== 'string') {
				throw new TypeError('invalid parameter "attribute.name". Expected a string.');
			}

			if (typeof attribute.type !== 'number') {
				throw new TypeError('invalid parameter "attribute.type". Expected a number.');
			}
	
			const byteSize = Attribute.TypeToByteSize(attribute.type);
			this.stride += byteSize;
			this.storage.push(new Attribute(attribute.name, attribute.type, offset));
			offset += byteSize;
		}
	}
}
