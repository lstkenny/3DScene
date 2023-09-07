class Vec2 {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}
	add(vec) {
		this.x += vec.x
		this.y += vec.y
		return this
	}
	static add(vec1, vec2) {
		return vec1.clone().add(vec2)
	}
	sub(vec) {
		this.x -= vec.x
		this.y -= vec.y
		return this
	}
	static sub(vec1, vec2) {
		return vec1.clone().sub(vec2)
	}
	mult(multiplier) {
		if (multiplier instanceof Vec2) {
			return this.dotProduct(multiplier)
		} else {
			this.x *= multiplier
			this.y *= multiplier
			return this
		}
	}
	static mult(vec, multiplier) {
		return vec.clone().mult(multiplier)
	}
	dotProduct(vec) {
		return this.x * vec.x + this.y * vec.y
	}
	static dotProduct(vec1, vec2) {
		return vec1.dotProduct(vec2)
	}
	mag() {
		return this.mult(1 / this.len())
	}
	projection(vec) {
		return this.mult(vec) / vec.len()
	}
	static projection(vec1, vec2) {
		return vec1.clone().projection(vec2)
	}
	len() {
		return Math.hypot(
			this.x,
			this.y
		)
	}
	distance(vec) {
		return Math.hypot(
			this.x - vec.x, 
			this.y - vec.y
		)
	}
	angle() {
		let angle = Math.atan(this.y / this.x)
		if (this.x < 0) {
			angle += Math.PI
		} else if (this.x >= 0 && this.y < 0) {
			angle += Math.PI * 2
		}
		return angle
	}
	rotate(angle) {
		const ca = Math.cos(angle)
		const sa = Math.sin(angle)
		const x = this.x * ca - this.y * sa
		const y = this.x * sa + this.y * ca
		this.x = x
		this.y = y
		return this
	}
	resize(scalar) {
		return this.mult(scalar / this.len())
	}
	inverse() {
		return this.mult(-1)
	}
	clone() {
		return new Vec2(this.x, this.y)
	}
}

export default Vec2