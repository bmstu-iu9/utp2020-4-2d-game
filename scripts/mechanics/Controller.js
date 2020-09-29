import Player from './Player.js';
import Follower from './Follower.js';
import * as CORE from '../core/Core.js';

export default class Controller extends CORE.GameComponent {
	constructor(deadline, leftButton, rightButton, topButton, bottomButton, jumpButton) {
		super();
		this.canJump = true;
		this.deadline = deadline;
		this.leftButton = leftButton;
		this.rightButton = rightButton;
		this.topButton = topButton;
		this.bottomButton = bottomButton;
		this.jumpButton = jumpButton;
		if (CORE.Platform.current !== CORE.Platform.ios && CORE.Platform.current !== CORE.Platform.android) {
			this.leftButton.htmlObject.style.display = 'none';
			this.rightButton.htmlObject.style.display = 'none';
			this.topButton.htmlObject.style.display = 'none';
			this.bottomButton.htmlObject.style.display = 'none';
			this.jumpButton.htmlObject.style.display = 'none';
			return;
		}

		this.topButton.htmlObject.style.display = 'none';
		this.bottomButton.htmlObject.style.display = 'none';
		const component = this;
		this.leftButtonPressed = false;
		this.rightButtonPressed = false;
		this.topButtonPressed = false;
		this.bottomButtonPressed = false;
		this.leftButton.addEventListener('pointerdown', () => component.leftButtonPressed = true);
		this.leftButton.addEventListener('pointerup', () => component.leftButtonPressed = false);
		this.leftButton.addEventListener('pointerout', () => component.leftButtonPressed = false);

		this.rightButton.addEventListener('pointerdown', () => component.rightButtonPressed = true);
		this.rightButton.addEventListener('pointerup', () => component.rightButtonPressed = false);
		this.rightButton.addEventListener('pointerout', () => component.rightButtonPressed = false);

		this.topButton.addEventListener('pointerdown', () => component.topButtonPressed = true);
		this.topButton.addEventListener('pointerup', () => component.topButtonPressed = false);
		this.topButton.addEventListener('pointerout', () => component.topButtonPressed = false);

		this.bottomButton.addEventListener('pointerdown', () => component.bottomButtonPressed = true);
		this.bottomButton.addEventListener('pointerup', () => component.bottomButtonPressed = false);
		this.bottomButton.addEventListener('pointerout', () => component.bottomButtonPressed = false);

		this.jumpButton.addEventListener('pointerdown', () => component.jump());
	}

	onInitialize() {
		/**
		 * @type {CORE.RigidBody}
		 */
		this.rigidBody = this.gameObject.getComponent(CORE.RigidBody);
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
		this.isFreeze = false;
		/**
		 * @type {CORE.Animator}
		 */
		this.animator = this.gameObject.getComponent(CORE.Animator);
		if (this.animator == null) {
			throw new Error('no animator.');
		}
		this.state = 'idle';
	}

	relocate(destination) {
		this.transform.setPosition(destination);
	}

	changeState(state) {
		if (this.state === state) {
			return;
		}
		this.animator.play(state);
		this.state = state;
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
			if (CORE.Platform.current === CORE.Platform.ios || CORE.Platform.current === CORE.Platform.android) {
				this.topButton.htmlObject.style.display = 'block';
				this.bottomButton.htmlObject.style.display = 'block';
				this.jumpButton.htmlObject.style.display = 'none';
			}
		}
	}

	onTriggerExit(collider) {
		if (collider.gameObject.name === 'ladder') {
			this.isLadder = false;
			this.rigidBody.setKinematic(false);
			if (CORE.Platform.current === CORE.Platform.ios || CORE.Platform.current === CORE.Platform.android) {
				this.topButton.htmlObject.style.display = 'none';
				this.bottomButton.htmlObject.style.display = 'none';
				this.jumpButton.htmlObject.style.display = 'block';
			}
		}
	}

	onFixedUpdate(delta) {
		if (this.freezeTime > 0) {
			this.freezeTime -= delta;
		}
	}

	moveLeft() {
		const speed = this.isLadder ? -3 : -5;
		this.rigidBody.setVelocity(new CORE.Vector2d(speed, this.rigidBody.velocity.y));
		this.transform.setLocalScale(new CORE.Vector2d(-0.8, 0.8));
		this.changeState('walk');
	}

	moveRight() {
		const speed = this.isLadder ? 3 : 5;
		this.rigidBody.setVelocity(new CORE.Vector2d(speed, this.rigidBody.velocity.y));
		this.transform.setLocalScale(new CORE.Vector2d(0.8, 0.8));
		this.changeState('walk');
	}

	moveTop() {
		this.rigidBody.setVelocity(new CORE.Vector2d(this.rigidBody.velocity.x, 3));
	}

	moveBottom() {
		this.rigidBody.setVelocity(new CORE.Vector2d(this.rigidBody.velocity.x, -3));
	}

	jump() {
		if (this.canJump) {
			if (this.isTrampoline) {
				this.rigidBody.addForce(new CORE.Vector2d(0, 1400));
			} else {
				this.rigidBody.addForce(new CORE.Vector2d(0, 700));
			}
			this.canJump = false;
		}
	}

	onUpdate() {
		const follower = this.gameObject.scene.camera.getComponent(Follower);
		follower.isLookDown = false;
		if (this.isLadder) {
			if (
				CORE.Input.getKeyPressed('KeyW')
				|| CORE.Input.getKeyPressed('ArrowUp')
				|| this.topButtonPressed
			) {
				this.moveTop();
			} else if (
				CORE.Input.getKeyPressed('KeyS')
				|| CORE.Input.getKeyPressed('ArrowDown')
				|| this.bottomButtonPressed
			) {
				this.moveBottom();
			} else {
				this.rigidBody.setVelocity(new CORE.Vector2d(this.rigidBody.velocity.x, 0));
			}

			if (
				CORE.Input.getKeyPressed('KeyA')
				|| CORE.Input.getKeyPressed('ArrowLeft')
				|| this.leftButtonPressed
			) {
				this.moveLeft();
			} else if (
				CORE.Input.getKeyPressed('KeyD')
				|| CORE.Input.getKeyPressed('ArrowRight')
				|| this.rightButtonPressed
			) {
				this.moveRight();
			} else {
				this.rigidBody.setVelocity(new CORE.Vector2d(0, this.rigidBody.velocity.y));
				this.changeState('idle');
			}
		} else {
			if (
				CORE.Input.getKeyPressed('KeyA')
				|| CORE.Input.getKeyPressed('ArrowLeft')
				|| this.leftButtonPressed
			) {
				this.moveLeft();
			} else if (
				CORE.Input.getKeyPressed('KeyD')
				|| CORE.Input.getKeyPressed('ArrowRight')
				|| this.rightButtonPressed
			) {
				this.moveRight();
			} else {
				follower.isLookDown = CORE.Input.getKeyPressed('KeyS') || CORE.Input.getKeyPressed('ArrowDown');
				follower.isLookDown &&= this.canJump;
				this.rigidBody.setVelocity(new CORE.Vector2d(0, this.rigidBody.velocity.y));
				this.changeState('idle');
			}

			if (CORE.Input.getKeyDown('Space') || CORE.Input.getKeyDown('ArrowUp')) {
				this.jump();
			}
		}
		if (this.transform.position.y < this.deadline) {
			this.gameObject.scene.reload();
		}
	}
}
