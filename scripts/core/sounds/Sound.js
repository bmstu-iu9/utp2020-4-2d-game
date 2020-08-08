export default class Sound {
	constructor(buffer) {
		this.buffer = buffer;
	}

	createSourceNode(context) {
		const sourceNode = context.createBufferSource();
		sourceNode.buffer = this.buffer;
		return sourceNode;
	}
}
