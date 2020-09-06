import GameComponent from '../core/GameComponent.js';
import RigidBody from '../core/physics/RigidBody.js';
import Player from './Player.js';
import Follower from './Follower.js';
import Vector2d from '../core/mathematics/Vector2d.js';
import Animator from '../core/animations/Animator.js';
import Input from '../core/Input.js';

export default class Controller extends GameComponent {
	constructor(deadline) {
		super();
		this.deadline = deadline;
	}

	onInitialize() {
		/**
		 * @type {RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(RigidBody);
		if (this.rigidBody == null) {
			throw new Error('no rigid body.');
		}
		/**
		 * @type {Player}
		 */
		this.player = this.gameObject.getComponent(Player);
		if (this.player == null) {
			throw new Error('no player.');
		}
		/**
		 * @type {Follower}
		 */
		this.follower = this.gameObject.scene.camera.getComponent(Follower);
		if (this.follower == null) {
			throw new Error('no follower.');
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
		this.isFreeze = false;
		this.canJump = true;
		if (collider.gameObject.name === 'trampoline') {
			this.isTrampoline = true;
		}
	}

	onCollisionExit(collider) {
		if (collider.gameObject.name === 'trampoline') {
			this.isTrampoline = false;
		}
	}

	onTriggerEnter(collider) {
		if (collider.gameObject.name === 'ladder') {
			this.isLadder = true;
			this.rigidBody.setKinematic(true);
		}
	}

	onTriggerExit(collider) {
		if (collider.gameObject.name === 'ladder') {
			this.isLadder = false;
			this.rigidBody.setKinematic(false);
		}
	}

	onFixedUpdate(delta) {
		if (this.freezeTime > 0) {
			this.freezeTime -= delta;
		}
	}

	onUpdate() {
		this.follower.isLookDown = false;
		if (this.isLadder) {
			if (Input.getKeyPressed('KeyW')) {
				this.rigidBody.setVelocity(new Vector2d(this.rigidBody.velocity.x, 3));
			} else if (Input.getKeyPressed('KeyS')) {
				this.rigidBody.setVelocity(new Vector2d(this.rigidBody.velocity.x, -3));
			} else {
				this.rigidBody.setVelocity(new Vector2d(this.rigidBody.velocity.x, 0));
			}
			if (Input.getKeyPressed('KeyA')) {
				this.rigidBody.setVelocity(new Vector2d(-3, this.rigidBody.velocity.y));
				this.transform.setLocalScale(new Vector2d(-0.8, 0.8));
				this.changeState('walk');
			} else if (Input.getKeyPressed('KeyD')) {
				this.rigidBody.setVelocity(new Vector2d(3, this.rigidBody.velocity.y));
				this.transform.setLocalScale(new Vector2d(0.8, 0.8));
				this.changeState('walk');
			} else {
				this.rigidBody.setVelocity(new Vector2d(0, this.rigidBody.velocity.y));
				this.changeState('idle');
			}
		} else {
			if (Input.getKeyPressed('KeyA')) {
				this.rigidBody.setVelocity(new Vector2d(-5, this.rigidBody.velocity.y));
				this.transform.setLocalScale(new Vector2d(-0.8, 0.8));
				this.changeState('walk');
			} else if (Input.getKeyPressed('KeyD')) {
				this.rigidBody.setVelocity(new Vector2d(5, this.rigidBody.velocity.y));
				this.transform.setLocalScale(new Vector2d(0.8, 0.8));
				this.changeState('walk');
			} else {
				this.rigidBody.setVelocity(new Vector2d(0, this.rigidBody.velocity.y));
				this.changeState('idle');
			}
			if (Input.getKeyDown('Space') && this.canJump) {
				if (this.isTrampoline) {
					this.rigidBody.addForce(new Vector2d(0, 1400));
				} else {
					this.rigidBody.addForce(new Vector2d(0, 700));
				}
				this.canJump = false;
			}
		}
		if (this.transform.position.y < this.deadline) {
			this.player.decreaseLife();
		}
	}
}