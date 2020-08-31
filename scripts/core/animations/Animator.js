import KeyFrame from './KeyFrame.js';
import Animation from './Animation.js';
import GameComponent from '../GameComponent.js';

export default class Animator extends GameComponent {
	/**
	 * @type {Set<Animator>}
	 */
	static animators = new Set();

	/**
	 * @param {Animation[]} animations  Массив доступных анимаций.
	 * @param {string}      animationId Начальная анимация.
	 */
	constructor(animations, animationId = null) {
		super();
		this.animations = {};
		animations.forEach(([id, animation]) => {
			if (typeof id !== 'string') {
				throw new TypeError('invalid parameter "id". Expected a string.');
			}
			if (id.trim() === '') {
				throw new Error('invalid parameter "id". Expected a non-empty string.');
			}
			if (this.animations[id] != null) {
				throw new Error(`id "${id}" already existed`);
			}
			if (!(animation instanceof Animation)) {
				throw new TypeError('invalid parameter "animation". Expected an instance of Animation class.');
			}
			this.animations[id] = animation;
		});
		if (animationId != null && typeof animationId !== 'string') {
			throw new TypeError('invalid parameter "animationId". Expected a string.');
		}
		this.play(animationId);
	}

	allowMultipleComponents() {
		return false;
	}

	onEnable() {
		Animator.animators.add(this);
	}

	onDisable() {
		Animator.animators.delete(this);
	}

	process(deltaTime) {
		if (this.currentAnimation == null) {
			return;
		}
		this.currentTime += deltaTime;
		if (this.currentKeyFrame == this.currentAnimation.keyFrames.length) {
			if (this.currentAnimation.time <= this.currentTime) {
				if (this.currentAnimation.loop) {
					this.currentKeyFrame = 0;
					this.currentTime = 0;
				} else {
					this.stop();
				}
			}
			return;
		}
		const keyFrame = this.currentAnimation.keyFrames[this.currentKeyFrame];
		if (keyFrame.time <= this.currentTime) {
			keyFrame.process(this.gameObject);
			this.currentKeyFrame++;
			if (this.currentKeyFrame == this.currentAnimation.keyFrames.length) {
				if (this.currentAnimation.loop) {
					if (this.currentAnimation.time <= this.currentTime) {
						this.currentKeyFrame = 0;
						this.currentTime = 0;
					}
				} else if (this.currentAnimation.time <= this.currentTime) {
					this.stop();
				}
			}
		}
	}
	
	/**
	 * Включает анимацию.
	 * 
	 * @param {string} animationId Идентификатор анимации, которую необходимо включить.
	 */
	play(animationId) {
		if (animationId == null) {
			this.stop();
		} else {
			if (typeof animationId !== 'string') {
				throw new TypeError('invalid parameter "animationId". Expected a string.');
			}
			const animation = this.animations[animationId];
			if (animation == null) {
				throw new Error(`not exist animation with id "${animationId}".`);
			}
			this.currentAnimation = animation;
			this.currentKeyFrame = 0;
			this.currentTime = 0;
		}
	}

	/**
	 * Выключает анимацию.
	 */
	stop() {
		this.currentAnimation = null;
		this.currentKeyFrame = null;
		this.currentTime = 0;
	}
}