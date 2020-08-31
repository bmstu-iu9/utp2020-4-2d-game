import GameComponent from '../../core/GameComponent.js';
import RigidBody from '../../core/physics/RigidBody.js';
import Animator from '../../core/animations/Animator.js';
import Vector2d from '../../core/mathematics/Vector2d.js';
import Input from '../../core/Input.js';

export default class Controller2 extends GameComponent {
	onInitialize() {
		/**
		 * @type {RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(RigidBody);
		if (this.rigidBody == null) {
			throw new Error('no rigid body.');
		}
		this.isFreeze = false;
		/**
		 * @type {Animator}
		 */
		this.animator = this.gameObject.getComponent(Animator);
		if (this.animator == null) {
			throw new Error('no animator.');
		}
		this.state = 'idle';
	}

	changeState(state) {
		if (this.state === state) {
			return;
		}
		this.animator.play(state);
		this.state = state;
	}

	relocate(destination) {
		this.transform.setPosition(destination);
	}

	freeze() {
		if (!this.canJump) {
			this.isFreeze = true;
		}
	}

	onCollisionEnter(collider) {
		if (collider.gameObject.name === 'collider - 4') {
			this.isFreeze = false;
			this.canJump = true;
		}
	}

	onFixedUpdate(delta) {
		if (this.freezeTime > 0) {
			this.freezeTime -= delta;
		}
	}

	onUpdate() {
		if (Input.getKeyPressed('ArrowLeft')) {
			this.rigidBody.setVelocity(new Vector2d(-5, this.rigidBody.velocity.y));
			this.transform.setLocalScale(new Vector2d(-4, 4));
			this.changeState('walk');
		} else if (Input.getKeyPressed('ArrowRight')) {
			this.rigidBody.setVelocity(new Vector2d(5, this.rigidBody.velocity.y));
			this.transform.setLocalScale(new Vector2d(4, 4));
			this.changeState('walk');
		} else {
			this.rigidBody.setVelocity(new Vector2d(0, this.rigidBody.velocity.y));
			this.changeState('idle');
		}
		if (Input.getKeyDown('ArrowUp') && this.canJump) {
			this.rigidBody.addForce(new Vector2d(0, 550));
			this.canJump = false;
		}
	}
}