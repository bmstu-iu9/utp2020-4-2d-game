import GameComponent from '../GameComponent.js';
import Vector2d from '../Vector2d.js';
import Material from './Material.js';
import Collider from './Collider.js';

export default class RigidBody extends GameComponent {
	/**
	 * @type {Set<RigidBody>}
	 */
	static dynamicRigidBodies = new Set();

	static gravity = new Vector2d(0, -9.81);

	/**
	 * @param {object}   settings              Настройки твердого тела.
	 * @param {Material} settings.material     Материал, из которого должно состоять данное тело.
	 * @param {boolean}  settings.isKinematic  Должено ли быть тело статическим.
	 * @param {Vector2d} settings.velocity     Начальная скорость.
	 * @param {number}   settings.gravityScale Влияние гравитации.
	 */
	constructor({material, isKinematic = false, velocity = Vector2d.zero, gravityScale = 1}) {
		super();
		if (!(material instanceof Material)) {
			throw new TypeError('invalid parameter "material". Expected an instance of Material class.');
		}
		if (typeof isKinematic !== 'boolean') {
			throw new TypeError('invalid parameter "isKinematic". Expected a boolean value.');
		}
		if (!(velocity instanceof Vector2d)) {
			throw new TypeError('invalid parameter "velocity". Expected an instance of Vector2d class.');
		}
		if (typeof gravityScale !== 'number') {
			throw new TypeError('invalid parameter "gravityScale". Expected a number.');
		}
		this.material = material;
		this.isKinematic = isKinematic;
		this.velocity = velocity;
		this.gravityScale = gravityScale;
		this.force = Vector2d.zero;
	}

	recalculate() {
		if (this.isKinematic) {
			this.mass = this.invMass = 0;
			return;
		}
		const collider = this.gameObject.getComponent(Collider);
		this.mass = collider != null ? this.material.density * collider.area : 0;
		this.invMass = this.mass != 0 ? 1 / this.mass : 0;
	}

	onEnable() {
		if (!this.transform.isStatic) {
			RigidBody.dynamicRigidBodies.add(this);
		}
		this.recalculate();
	}

	allowMultipleComponents() {
		return false;
	}

	integrateForces(deltaTime) {
		if (this.isStatic || this.isKinematic) {
			return;
		}
		const gravity = RigidBody.gravity.multiply(this.gravityScale);
		this.velocity = this.velocity.add(this.force.multiply(this.invMass).add(gravity).multiply(deltaTime / 2));
	}

	integrateVelocity(deltaTime) {
		if (this.isStatic) {
			return;
		}
		this.transform.setPosition(this.transform.position.add(this.velocity.multiply(deltaTime)));
		this.integrateForces(deltaTime);
	}

	clearForce() {
		this.force = Vector2d.zero;
	}

	/**
	 * Добавляет силу к данному телу.
	 *
	 * @param {Vector2d} force
	 */
	addForce(force) {
		if (!(force instanceof Vector2d)) {
			throw new TypeError('invalid parameter "force". Expected an instance of Vector2d class.');
		}
		this.force = this.force.add(force);
	}

	/**
	 * Устанавливает скорость для данного тела.
	 *
	 * @param {Vector2d} velocity
	 */
	setVelocity(velocity) {
		if (!(velocity instanceof Vector2d)) {
			throw new TypeError('invalid parameter "velocity". Expected an instance of Vector2d class.');
		}
		this.velocity = velocity;
	}

	/**
	 * Перемещает тело к позиции с указанной скоростью.
	 *
	 * @param {Vector2d} position Точка прибытия.
	 * @param {number}   speed
	 */
	moveTo(position, speed) {
		if (!this.isKinematic) {
			throw new Error('cannot move a non-kinematic body.');
		}
		if ((!position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}
		if (typeof speed !== 'number') {
			throw new TypeError('invalid parameter "speed". Expected a number.');
		}
		const path = position.subtract(this.transform.position);
		this.velocity = path.squaredLength() > speed * speed ? path.normalize().multiply(speed) : path;
	}

	onDisable() {
		RigidBody.rigidBodies.delete(this);
	}
}
