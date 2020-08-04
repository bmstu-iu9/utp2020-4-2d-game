export default class Material {
    /**
     * @param {number} density     Плотность материала.
     * @param {number} restitution Упругость материала.
     */
    constructor(density, restitution) {
        if (typeof density !== 'number') {
            throw new TypeError('invalid parameter "density". Expected a number.');
        }
        if (typeof restitution !== 'number') {
            throw new TypeError('invalid parameter "restitution". Expected a number.');
        }
        this.density = density;
        this.restitution = restitution;
    }
}
