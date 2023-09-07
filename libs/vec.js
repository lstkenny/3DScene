class Vec {
	constructor(x = 0, y = 0, z = 0) {
		this.x = Number(x)
		this.y = Number(y)
		this.z = Number(z)
	}
	add(vec) {
		this.x += vec.x
		this.y += vec.y
		this.z += vec.z
		return this
	}
	static add(vec1, vec2) {
		return vec1.clone().add(vec2)
	}
	sub(vec) {
		this.x -= vec.x
		this.y -= vec.y
		this.z -= vec.z
		return this
	}
	static sub(vec1, vec2) {
		return vec1.clone().sub(vec2)
	}
	mult(multiplier) {
		if (multiplier instanceof Vec) {
			return this.dot(multiplier)
		} else if (Array.isArray(multiplier)) {
			return this.multMatrix(multiplier)
		} else {
			this.x *= multiplier
			this.y *= multiplier
			this.z *= multiplier
			return this
		}
	}
	static mult(vec, multiplier) {
		return vec.clone().mult(multiplier)
	}
	div(divider) {
		return this.mult(1 / divider)
	}
	static div(vec, divider) {
		return vec.clone().div(divider)
	}  
	multMatrix(matrix) {
		const vec = this.clone()
		const w = (vec.x * matrix[0][3] + vec.y * matrix[1][3] + vec.z * matrix[2][3] + matrix[3][3]) || 1
		this.x = (vec.x * matrix[0][0] + vec.y * matrix[1][0] + vec.z * matrix[2][0] + matrix[3][0]) / w
		this.y = (vec.x * matrix[0][1] + vec.y * matrix[1][1] + vec.z * matrix[2][1] + matrix[3][1]) / w
		this.z = (vec.x * matrix[0][2] + vec.y * matrix[1][2] + vec.z * matrix[2][2] + matrix[3][2]) / w
		return this
	}
	static multMatrix(vec, matrix) {
		return vec.clone().multMatrix(matrix)
	}
	dot(vec) {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z
	}
	static dot(vec1, vec2) {
		return vec1.dot(vec2)
	}
	cross(vec2) {
		const vec1 = this.clone()
		this.x = vec1.y * vec2.z - vec1.z * vec2.y
		this.y = vec1.z * vec2.x - vec1.x * vec2.z
		this.z = vec1.x * vec2.y - vec1.y * vec2.x
		return this
	}
	static cross(vec1, vec2) {
		return vec1.clone().cross(vec2)
	}
	mag() {
		return this.mult(1 / this.len())
	}
	project(vec) {
		return this.mult(vec) / vec.len()
	}
	static project(vec1, vec2) {
		return vec1.clone().project(vec2)
	}
	len() {
		return Math.hypot(
			this.x,
			this.y,
			this.z
		)
	}
	dist(vec) {
		return Math.hypot(
			this.x - vec.x, 
			this.y - vec.y,
			this.z - vec.z
		)
	}
	static dist(vec1, vec2) {
		return vec1.dist(vec2)
	}
	scale(vec) {
		this.x *= vec.x
		this.y *= vec.y
		this.z *= vec.z
		return this
	}
	static scale(vec1, vec2) {
		return vec1.clone().scale(vec2)
	}
	resize(scalar) {
		return this.mult(scalar / this.len())
	}
	normal() {
		return this.resize(1)
	}
	inverse() {
		return this.mult(-1)
	}
	clone() {
		return new Vec(this.x, this.y, this.z)
	}
}

export default Vec