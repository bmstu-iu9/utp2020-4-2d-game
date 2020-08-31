import GameComponent from '../../core/GameComponent.js';
import Controller1 from './Controller1.js';
import Controller2 from './Controller2.js';
import Vector2d from '../../core/mathematics/Vector2d.js';
import RigidBody from '../../core/physics/RigidBody.js';

export default class Voleyball extends GameComponent {
	constructor(p1, p2, pStart, ballStart, maxScore) {
		super();
		this.p1 = p1;
		this.p2 = p2;
		this.pStart = pStart;
		this.ballStart = ballStart;
		this.player1Score = 0;
		this.player2Score = 0;
		this.maxScore = maxScore;
	}

	onInitialize() {
		/**
		 * @type {Contorller1}
		 */
		this.controller1 = this.p1.getComponent(Controller1);
		if (this.controller1 == null) {
			throw new Error('no controller1.');
		}
		/**
		 * @type {Controller2}
		 */
		this.controller2 = this.p2.getComponent(Controller2);
		if (this.controller2 == null) {
			throw new Error('no controller2.');
		}
	}

	begin1() {
		if (this.player2Score == this.maxScore) {
			this.gameObject.scene.reload();
		} else {
			this.controller1.relocate(this.pStart);
			this.controller2.relocate(new Vector2d(this.pStart.x + 8, this.pStart.y));
			this.gameObject.getComponent(RigidBody).setVelocity(Vector2d.zero);
			this.transform.setPosition(this.ballStart);
		}
	}

	begin2() {
		if (this.player1Score == this.maxScore) {
			this.gameObject.scene.reload();
		} else {
			this.controller1.relocate(this.pStart);
			this.controller2.relocate(new Vector2d(this.pStart.x + 8, this.pStart.y));
			this.gameObject.getComponent(RigidBody).setVelocity(Vector2d.zero);
			this.transform.setPosition(new Vector2d(this.ballStart.x + 6, this.ballStart.y));
		}
	}
	
	onCollisionEnter(collider) {
		if (collider.gameObject.name === 'collider - 4' && this.gameObject.transform.position.x < 2) {
			this.player2Score++;
			this.begin1();
		} else if (collider.gameObject.name === 'collider - 4') {
			this.player1Score++;
			this.begin2();
		}
	}
}