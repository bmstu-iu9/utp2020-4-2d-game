import GameComponent from '../GameComponent.js';
import Vector2d from '../mathematics/Vector2d.js';
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
	 * @param {boolean}  settings.isKinematic  Должно ли тело игнорировать внешние силы.
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
		this.mass = this.invMass = 0;
	}

	recalculate() {
		if (this.isKinematic) {
			this.mass = this.invMass = 0;
			return;
		}
		const calculateArea = (gameObject, isChild) => {
			if (gameObject == null) {
				return 0;
			}
			const collider = gameObject.getComponent(Collider);
			if (isChild && gameObject.getComponent(RigidBody) != null) {
				return 0;
			}
			let result = collider != null ? collider.area : 0;
			gameObject.children.forEach(child => {
				result += calculateArea(child, true);
			});
			return result;
		}
		this.mass = this.material.density * calculateArea(this.gameObject);
		this.invMass = this.mass != 0 ? 1 / this.mass : 0;
	}

	/**
	 * @param {boolean} value Должно ли тело игнорировать внешние силы.
	 */
	setKinematic(value) {
		if (typeof value !== 'boolean') {
			throw new TypeError('invalid parameter "value". Expected a boolean value.');
		}
		if (this.isKinematic != value) {
			this.isKinematic = value;
			if (this.isKinematic) {
				this.clearForce();
			}
			this.recalculate();
		}
	}

	onEnable() {
		if (!this.transform.isStatic) {
			RigidBody.dynamicRigidBodies.add(this);
			this.recalculate();
		}
	}

	allowMultipleComponents() {
		return false;
	}

	integrateForces(deltaTime) {
		if (this.transform.isStatic || this.isKinematic) {
			return;
		}
		const gravity = RigidBody.gravity.multiply(this.gravityScale);
		this.velocity = this.velocity.add(this.force.multiply(this.invMass).add(gravity).multiply(deltaTime / 2));
	}

	integrateVelocity(deltaTime) {
		if (this.transform.isStatic) {
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
		if (this.isKinematic) {
			throw new Error('cannot add force to kinematic body.');
		}
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
	 * @param {Vector2d} position       Точка прибытия.
	 * @param {number}   speed
	 * @param {number}   fixedDeltaTime Фиксированное время обновления логики игры в секундах.
	 */
	moveTo(position, speed, fixedDeltaTime) {
		if (!this.isKinematic) {
			throw new Error('cannot move a non-kinematic body.');
		}
		if ((!position instanceof Vector2d)) {
			throw new TypeError('invalid parameter "position". Expected an instance of Vector2d class.');
		}
		if (typeof speed !== 'number') {
			throw new TypeError('invalid parameter "speed". Expected a number.');
		}
		if (typeof fixedDeltaTime != 'number') {
			throw new TypeError('invalid parameter "fixedDeltaTime". Expected a number.');
		}
		const path = position.subtract(this.transform.position);
		const speedWithDelta = speed * fixedDeltaTime;
		if (path.squaredLength() >= speedWithDelta * speedWithDelta) {
			this.velocity = path.normalize().multiply(speed);
		} else {
			this.velocity = Vector2d.zero;
			this.transform.setPosition(position);
		}
	}

	onDisable() {
		RigidBody.dynamicRigidBodies.delete(this);
	}
}
