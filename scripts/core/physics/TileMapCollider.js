import Rect from '../graphics/Rect.js';
import GameComponent from '../GameComponent.js';
import TileMap from '../graphics/TileMap.js';
import BoxCollider from './BoxCollider.js';
import Vector2d from '../mathematics/Vector2d.js';
import GameObject from '../GameObject.js';
import SpriteRenderer from '../graphics/SpriteRenderer.js';
import Sprite from '../graphics/Sprite.js';

class Edge {
	constructor(direction, begin, end, id) {
		this.direction = direction;
		this.begin = begin;
		this.end = end;
		this.id = id;
	}
}

const vertexType = Object.freeze({
	concaveLeftTop: 1,
	concaveRightTop: 2,
	concaveRightBottom: 3,
	concaveLeftBottom: 4,
	convex: 5,
	horizontal: 6,
	vertical: 7,
	horizontalAndVertical: 8,
});

class Graph {
	constructor(vertexMatrix) {
		let id = 0;
		this.verticalEdges = [];
		this.horizontalEdges = [];
		this.adjacencyList = [];
		for (let i = 0; i < vertexMatrix.length; i++) {
			for (let j = 0; j < vertexMatrix[i].length; j++) {
				if (
					vertexMatrix[i][j] === vertexType.concaveRightTop
					|| vertexMatrix[i][j] === vertexType.concaveRightBottom
				) {
					for (let z = j + 1; z < vertexMatrix[i].length; z++) {
						if (
							vertexMatrix[i][z] === vertexType.concaveLeftTop
							|| vertexMatrix[i][z] === vertexType.concaveLeftBottom
						) {
							this.horizontalEdges.push(new Edge(i, j, z, id));
							this.adjacencyList[id] = [];
							for (let edge of this.verticalEdges) {
								if (edge.direction <= z && edge.direction >= j && edge.begin <= i && edge.end >= i) {
									this.adjacencyList[edge.id].push(id);
									this.adjacencyList[id].push(edge.id);
								}
							}

							id++;
							break;
						}
					}
				}

				if (
					vertexMatrix[i][j] === vertexType.concaveLeftBottom
					|| vertexMatrix[i][j] === vertexType.concaveRightBottom
				) {
					for (let z = i + 1; z < vertexMatrix.length; z++) {
						if (
							vertexMatrix[z][j] === vertexType.concaveLeftTop
							|| vertexMatrix[z][j] === vertexType.concaveRightTop
						) {
							this.verticalEdges.push(new Edge(j, i, z, id));
							this.adjacencyList[id] = [];
							for (let edge of this.horizontalEdges) {
								if (edge.direction <= z && edge.direction >= i && edge.begin <= j && edge.end >= j) {
									this.adjacencyList[edge.id].push(id);
									this.adjacencyList[id].push(edge.id);
								}
							}

							id++;
							break;
						}
					}
				}
			}
		}

		this.pair = new Array(this.horizontalEdges.length + this.verticalEdges.length);
		this.distance = new Array(this.verticalEdges.length + this.horizontalEdges.length);
	}

	bfs() {
		let queue = [];
		for (let edge of this.horizontalEdges) {
			if (this.pair[edge.id] === null) {
				this.distance[edge.id] = 0;
				queue.push(edge.id);
			} else {
				this.distance[edge.id] = Infinity;
			}
		}

		this.distance[null] = Infinity;
		while (queue.length !== 0) {
			let u = queue.shift();
			if (this.distance[u] < this.distance[null]) {
				for (let v of this.adjacencyList[u]) {
					if (this.distance[this.pair[v]] === Infinity) {
						this.distance[this.pair[v]] = this.distance[u] + 1;
						queue.push(this.pair[v]);
					}
				}
			}
		}

		return this.distance[null] !== Infinity;
	}

	dfs(u) {
		if (u !== null) {
			for (let v of this.adjacencyList[u]) {
				if (this.distance[this.pair[v]] === this.distance[u] + 1) {
					if (this.dfs(this.pair[v])) {
						this.pair[v] = u;
						this.pair[u] = v;
						return true;
					}
				}
			}

			this.distance[u] = Infinity;
			return false;
		}

		return true;
	}

	hopcraftKarp() {
		this.pair.fill(null);
		while (this.bfs()) {
			for (let edge of this.horizontalEdges) {
				if (this.pair[edge.id] === null) {
					this.dfs(edge.id);
				}
			}
		}
	}

	selection(v) {
		this.pair[v] = Infinity;
		for (let u of this.adjacencyList[v]) {
			if (this.pair[u] === null) {
				continue;
			}
			selection(this.pair[u]);
			this.pair[u] = Infinity;
		}
	}

	createNewVertical(vertexMatrix) {
		for (let edge of this.horizontalEdges) {
			if (this.pair[edge.id] == null) {
				this.selection(edge.id);
			}
		}

		for (let edge of this.horizontalEdges) {
			if (this.pair[edge.id] === Infinity) {
				vertexMatrix[edge.direction][edge.begin] = vertexType.horizontal;
				vertexMatrix[edge.direction][edge.end] = vertexType.horizontal;
			}
		}

		let newVertical = [];
		for (let edge of this.verticalEdges) {
			if (this.pair[edge.id] !== Infinity) {
				vertexMatrix[edge.begin][edge.direction] = vertexType.vertical;
				vertexMatrix[edge.end][edge.direction] = vertexType.vertical;
				newVertical.push(edge);
			}
		}

		return newVertical;
	}
}

export default class TileMapCollider extends GameComponent {
	onInitialize() {
		/**
		 * @type {TileMap}
		 */
		this.tileMap = this.gameObject.getComponent(TileMap);
		this.rectList = [];
		let vertexMatrix = [];

		vertexMatrix[0] = [];
		for (let i = 0; i < this.tileMap.map.length; i++) {
			vertexMatrix[i + 1] = [];
			for (let j = 0; j < this.tileMap.map[i].length; j++) {
				if (this.tileMap.map[i][j] == null) {
					if (i > 0) {
						if (
							j > 0
							&& this.tileMap.map[i - 1][j] != null
							&& this.tileMap.map[i][j - 1] != null
							&& this.tileMap.map[i - 1][j - 1] != null
						) {
							vertexMatrix[i][j] = vertexType.concaveLeftTop;
						}

						if (
							j + 1 < this.tileMap.map[i].length
							&& this.tileMap.map[i - 1][j] != null
							&& this.tileMap.map[i][j + 1] != null
							&& this.tileMap.map[i - 1][j + 1] != null
						) {
							vertexMatrix[i][j + 1] = vertexType.concaveRightTop;
						}
					}

					if (i + 1 < this.tileMap.map.length) {
						if (
							i + 1 < this.tileMap.map.length
							&& j + 1 < this.tileMap.map[i].length
							&& this.tileMap.map[i + 1][j] != null
							&& this.tileMap.map[i][j + 1] != null
							&& this.tileMap.map[i + 1][j + 1] != null
						) {
							vertexMatrix[i + 1][j + 1] = vertexType.concaveRightBottom;
						}

						if (
							i + 1 < this.tileMap.map.length
							&& j > 0 && this.tileMap.map[i + 1][j] != null
							&& this.tileMap.map[i][j - 1] != null
							&& this.tileMap.map[i + 1][j - 1] != null
						) {
							vertexMatrix[i + 1][j] = vertexType.concaveLeftBottom;
						}
					}
				} else {
					if (i === 0 || this.tileMap.map[i - 1][j] == null) {
						if (j === 0 || this.tileMap.map[i][j - 1] == null) {
							vertexMatrix[i][j] = vertexType.convex;
						}

						if (
							j === this.tileMap.map[i].length - 1
							|| this.tileMap.map[i][j + 1] == null
						) {
							vertexMatrix[i][j + 1] = vertexType.convex;
						}
					}

					if (i === this.tileMap.map.length - 1 || this.tileMap.map[i + 1][j] == null) {
						if (j === 0 || this.tileMap.map[i][j - 1] == null) {
							vertexMatrix[i + 1][j] = vertexType.convex;
						}

						if (
							j === this.tileMap.map[i].length - 1
							|| this.tileMap.map[i][j + 1] == null
						) {
							vertexMatrix[i + 1][j + 1] = vertexType.convex;
						}
					}

					if (j === this.tileMap.map[i].length - 1) {
						if (
							i + 1 !== this.tileMap.map.length
							&& this.tileMap.map[i + 1].length > j + 1
							&& this.tileMap.map[i + 1][j + 1] != null
						) {
							vertexMatrix[i + 1][j + 1] = vertexType.concaveLeftBottom;
						}

						if (
							i !== 0
							&& this.tileMap.map[i - 1].length > j + 1
							&& this.tileMap.map[i - 1][j + 1] != null
						) {
							vertexMatrix[i][j + 1] = vertexType.concaveLeftTop;
						}
					}
				}
			}
		}

		const graph = new Graph(vertexMatrix);
		graph.hopcraftKarp();

		const newVertical = graph.createNewVertical(vertexMatrix);
		for (let i = 0; i < vertexMatrix.length; i++) {
			for (let j = 0; j < vertexMatrix[i].length; j++) {
				if (
					vertexMatrix[i][j] === vertexType.concaveRightTop
					|| vertexMatrix[i][j] === vertexType.concaveRightBottom
				) {
					vertexMatrix[i][j] = vertexType.horizontal;
					outer: for (let z = j + 1; z < vertexMatrix[i].length; z++) {
						if (z === this.tileMap.map[i].length || this.tileMap.map[i][z] == null) {
							vertexMatrix[i][z] = vertexType.horizontal;
							break;
						}

						for (let edge of newVertical) {
							if (edge.direction === z){
								vertexMatrix[i][z] = vertexType.horizontalAndVertical;
								break outer;
							}
						}
					}
				}

				if (
					vertexMatrix[i][j] === vertexType.concaveLeftTop
					|| vertexMatrix[i][j] === vertexType.concaveLeftBottom
				) {
					vertexMatrix[i][j] = vertexType.horizontal;
					outer: for (let z = j - 1; z >= 0; z--) {
						if (z === 0 || this.tileMap.map[i][z - 1] == null) {
							vertexMatrix[i][z] = vertexType.horizontal;
							break;
						}

						for (let edge of newVertical) {
							if (edge.direction === z) {
								vertexMatrix[i][z] = vertexType.horizontalAndVertical;
								break outer;
							}
						}
					}
				}
			}
		}

		for (let i = 0; i < this.tileMap.map.length; i++) {
			for (let j = 0; j < this.tileMap.map[i].length; j++) {
				if (
					(
						vertexMatrix[i][j] === vertexType.convex
						|| vertexMatrix[i][j] === vertexType.horizontalAndVertical
						|| (vertexMatrix[i][j] === vertexType.horizontal && this.tileMap.map[i][j - 1] == null)
						|| (
							vertexMatrix[i][j] === vertexType.vertical
							&& (i === 0 || this.tileMap.map[i - 1][j] == null)
						)
					)
					&& this.tileMap.map[i][j] != null
				) {
					let width, height;
					for (let z = j + 1; z < this.tileMap.map[i].length + 1; z++) {
						if (
							vertexMatrix[i][z] === vertexType.vertical
							|| vertexMatrix[i][z] === vertexType.horizontalAndVertical
							|| z === this.tileMap.map[i].length
							|| this.tileMap.map[i][z] == null
						) {
							width = z - j;
							break;
						}
					}

					for (let z = i + 1; z < this.tileMap.map.length + 1; z++) {
						if (
							vertexMatrix[z][j] === vertexType.horizontal
							|| vertexMatrix[z][j] === vertexType.horizontalAndVertical
							|| z === this.tileMap.map.length
							|| this.tileMap.map[z][j] == null
						) {
							height = z - i;
							break;
						}
					}

					this.rectList.push(new Rect(j, i, width, height));
				}
			}
		}

		this.rectList.forEach((rect, i) => {
			const x = rect.x + rect.width / 2 - Math.ceil(this.tileMap.width / 2) + 0.5;
			const y = -rect.y - rect.height / 2 + Math.ceil(this.tileMap.height / 2) - 0.5;
			this.gameObject.addChild(new GameObject({
				name: `collider - ${i}`,
				position: new Vector2d(x, y),
				scale: new Vector2d(rect.width, rect.height),
				components: [
					//new BoxCollider(rect.width, rect.height),
					new SpriteRenderer({
						sprite: new Sprite(this.gameObject.scene.resources.getTexture('ball')),
					})
				],
			}));
		});
	}
}
