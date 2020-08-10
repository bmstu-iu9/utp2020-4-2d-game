export default class Sound {
	constructor(buffer) {
		this.buffer = buffer;
	}
	
	/**
	 * @param {AudioContext} context
	 * 
	 * @return {AudioBufferSourceNode} Создает источник звука из буфера.
	 */
	createSourceNode(context) {
		const sourceNode = context.createBufferSource();
		sourceNode.buffer = this.buffer;
		return sourceNode;
	}
}
