import RendererComponent from './RendererComponent.js';
import Vector2d from '../mathematics/Vector2d.js';
import Color from './Color.js';
import Maths from '../mathematics/Maths.js';
import ParticleProperties from './ParticleProperties.js';

class ListElement{
	constructor(next = this, previous = this) {
		this.particle = new Particle();
		this.next = next;
		this.previous = previous;
	}
}

class Particle{
	constructor() {
		this.position;
		this.velocity;
		this.colorBegin;
		this.colorEnd;
		this.sizeBegin;
		this.sizeEnd;
		this.rotation;
		this.angularVelocity;
		this.lifeRemaining;
		this.active = false;
	}
}

export default class ParticleSystem extends RendererComponent {
	/**
	 * @param {object}             settings                    Настройки системы частицы.
	 * @param {ParticleProperties} settings.particleProperties Настройки частицы.
	 * @param {boolean}            settings.emission           Надо ли генерировать частицы каждый кадр.
	 * @param {number}             settings.particlesPerFrame  Количество частиц генерируемых за кадр.
	 * @param {number}             settings.poolSize           Максимальное количество активных частиц.
	 * @param {number}             settings.lifeTime           Время жизни одной частицы.
	 * @param {number}             settings.layer              Слой отрисовки.
	 */
	constructor({
		particleProperties,
		emission = false,
		particlesPerFrame = 5,
		poolSize = 1000,
		lifeTime = 1,
		layer = 0,
	}) {
		if (!(particleProperties instanceof ParticleProperties)) {
			throw new TypeError('invalid parameter "particleProperties". Expected an instance of ParticleProperties class.');
		}

		if (typeof emission !== 'boolean') {
			throw new TypeError('invalid parameter "emission". Expected a boolean.');
		}

		if (typeof particlesPerFrame !== 'number') {
			throw new TypeError('invalid parameter "particlesPerFrame". Expected a number.');
		}

		if (typeof poolSize !== 'number') {
			throw new TypeError('invalid parameter "poolSize". Expected a number.');
		}

		if (poolSize <= 0) {
			throw RangeError('invalid value "poolSize". Expected a number greater than 0.');
		}

		if (typeof lifeTime !== 'number') {
			throw new TypeError('invalid parameter "lifeTime". Expected a number.');
		}

		if (lifeTime <= 0) {
			throw RangeError('invalid value "lifeTime". Expected a number greater than 0.');
		}

		super(layer);
		this.poolSize = poolSize;
		this.firstElement = new ListElement();
		let previous = this.firstElement;
		for (let i = 1; i < poolSize; i++) {
			const listElement = new ListElement(this.firstElement, previous);
			previous.next = listElement;
			previous = listElement;
		}
		
		this.firstElement.previous = previous;
		this.freeElement = this.firstElement;
		this.particleProperties = particleProperties;
		this.particlesPerFrame = particlesPerFrame;
		this.emission = emission;
		this.activeParticles = 0;
		this.lifeTime = lifeTime;
	}

	onFixedUpdate(fixedDeltaTime) {
		for (let element = this.firstElement, i = 0; i < this.activeParticles; i++, element = element.next) {
			const particle = element.particle;

			particle.lifeRemaining -= fixedDeltaTime;
			if (particle.lifeRemaining <= 0) {
				particle.active = false;
				this.activeParticles--;
				this.firstElement = this.firstElement.next;
				continue;
			}

			particle.position.x += particle.velocity.x * fixedDeltaTime;
			particle.position.y += particle.velocity.y * fixedDeltaTime;
			particle.rotation += particle.angularVelocity * fixedDeltaTime;
		}

		if (this.emission) {
			const count = Maths.clamp(this.particlesPerFrame, 0, this.poolSize - this.activeParticles);
			for (let i = 0; i < count; i++) {
				this.emit(this.particleProperties);
			}
		}
	}

	draw(camera, context) {
		const offset = camera.worldToCameraPosition(Vector2d.zero);
		const first = this.freeElement.previous;
		for (let element = first, i = 0; i < this.activeParticles; i++, element = element.previous) {
			const particle = element.particle;

			let life = particle.lifeRemaining / this.lifeTime;
			let color = new Color(
				(particle.colorEnd.rgba[0] * (1 - life) + particle.colorBegin.rgba[0] * life) * 255,
				(particle.colorEnd.rgba[1] * (1 - life) + particle.colorBegin.rgba[1] * life) * 255,
				(particle.colorEnd.rgba[2] * (1 - life) + particle.colorBegin.rgba[2] * life) * 255,
				(particle.colorEnd.rgba[3] * (1 - life) + particle.colorBegin.rgba[3] * life) * 255,
			);
			let size = particle.sizeEnd * (1 - life) + particle.sizeBegin * life;
			context.save();
			context.fillStyle = color.rgbString();
			context.globalAlpha = color.rgba[3];
			context.translate(
				offset.x + particle.position.x * 100 + this.transform.position.x * 100,
				offset.y - particle.position.y * 100 - this.transform.position.y * 100
			);
			context.rotate(particle.rotation);
			context.fillRect(-size / 2, - size / 2, size, size);
			context.restore();
		}
	}

	/**
	 * Создает частицы с передаваемыми свойствами.
	 *
	 * @param {ParticleProperties} particleProperties Свойства частицы.
	 */
	emit(particleProperties) {
		if (this.freeElement === null || this.freeElement.particle.active) {
			return;
		}

		const particle = this.freeElement.particle;
		particle.active = true;
		particle.position = new Vector2d(particleProperties.position.x, particleProperties.position.y);
		particle.position.x += particleProperties.positionVariation.x * (Math.random() - 0.5);
		particle.position.y += particleProperties.positionVariation.y * (Math.random() - 0.5);
		particle.rotation = particleProperties.rotation + particleProperties.rotationVariation * (Math.random() - 0.5);

		particle.velocity = new Vector2d(particleProperties.velocity.x, particleProperties.velocity.y);
		particle.velocity.x += particleProperties.velocityVariation.x * (Math.random() - 0.5);
		particle.velocity.y += particleProperties.velocityVariation.y * (Math.random() - 0.5);
		particle.angularVelocity = particleProperties.angularVelocity;
		particle.angularVelocity += particleProperties.angularVelocityVariation * (Math.random() - 0.5);

		particle.colorBegin = particleProperties.colorBegin;
		particle.colorEnd = particleProperties.colorEnd;

		particle.lifeRemaining = this.lifeTime;
		const delta = particleProperties.sizeVariation * (Math.random() - 0.5);
		particle.sizeBegin = particleProperties.sizeBegin + delta;
		particle.sizeEnd = particleProperties.sizeEnd + delta;
		this.activeParticles++;
		this.freeElement = this.freeElement.next;
	}

	/**
	 * Включает или выключает генерацию частиц.
	 *
	 * @param {boolean} emission Надо ли включить генерацию частиц.
	 */
	setEmission(emission) {
		if (typeof emission !== 'boolean') {
			throw new TypeError('invalid parameter "emission". Expected a boolean.');
		}

		this.emission = emission;
	}

	/**
	 * Изменяет количество генерируемых за кадр частиц.
	 *
	 * @param {number} count Новое количество частиц.
	 */
	setParticlesPerFrame(count) {
		if (typeof count !== 'number') {
			throw new TypeError('invalid parameter "count". Expected a number.');
		}

		this.particlesPerFrame = count;
	}

	/**
	 * Изменяет свойства генерируемых частиц.
	 * @param {ParticleProperties} particleProperties Новые свойства частиц.
	 */
	setParticlesProperties(particleProperties) {
		if (!(particleProperties instanceof ParticleProperties)) {
			throw new TypeError('invalid parameter "particleProperties". Expected an instance of ParticleProperties class.');
		}

		this.particleProperties = particleProperties;
	}
}
