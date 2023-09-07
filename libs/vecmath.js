export default class VecMath {
	static clone = vec => ({
		x: vec.x,
		y: vec.y,
		z: vec.z,
	})
	static update = (vec1, vec2) => {
		vec1.x = vec2.x
		vec1.y = vec2.y
		vec1.z = vec2.z
	}
	static add = (vec1, vec2) => ({
		x: vec1.x + vec2.x,
		y: vec1.y + vec2.y,
		z: vec1.z + vec2.z,
	})
	static sub = (vec1, vec2) => ({
		x: vec1.x - vec2.x,
		y: vec1.y - vec2.y,
		z: vec1.z - vec2.z,
	})
	static scale = (vec1, vec2) => ({
		x: vec1.x * vec2.x,
		y: vec1.y * vec2.y,
		z: vec1.z * vec2.z,
	})
	static mult = (vec, multiplier) => ({
		x: vec.x * multiplier,
		y: vec.y * multiplier,
		z: vec.z * multiplier,
	})
	static div = (vec, divider) => this.mult(vec, 1 / divider)
	static dot = (vec1, vec2) => vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z
	static cross = (vec1, vec2) => ({
		x: vec1.y * vec2.z - vec1.z * vec2.y,
		y: vec1.z * vec2.x - vec1.x * vec2.z,
		z: vec1.x * vec2.y - vec1.y * vec2.x,
	})
	static len = vec => Math.hypot(
		vec.x, 
		vec.y, 
		vec.z,
	)
	static dist = (vec1, vec2) => Math.hypot(
		vec1.x - vec2.x,
		vec1.y - vec2.y,
		vec1.z - vec2.z,
	)
	static sin = vec => ({
		x: Math.sin(vec.x),
		y: Math.sin(vec.y),
		z: Math.sin(vec.z),
	})
	static cos = vec => ({
		x: Math.cos(vec.x),
		y: Math.cos(vec.y),
		z: Math.cos(vec.z),
	})
	static dotProject = (vec1, vec2) => this.dot(vec1, vec2) / this.len(vec2)
	static resize = (vec, scalar) => this.mult(vec, scalar / this.len(vec))
	static normal = vec => this.div(vec, this.len(vec))
	static inverse = vec => this.mult(vec, -1)
	static createMatrix = (rows, cols, value = 0) => {
		return Array.from(Array(rows), _ => Array(cols).fill(value))
	}
	static multVecMatrix = (vec, matrix) => {
		const w = (vec.x * matrix[0][3] + vec.y * matrix[1][3] + vec.z * matrix[2][3] + matrix[3][3]) || 1
		return {
			x: (vec.x * matrix[0][0] + vec.y * matrix[1][0] + vec.z * matrix[2][0] + matrix[3][0]) / w,
			y: (vec.x * matrix[0][1] + vec.y * matrix[1][1] + vec.z * matrix[2][1] + matrix[3][1]) / w,
			z: (vec.x * matrix[0][2] + vec.y * matrix[1][2] + vec.z * matrix[2][2] + matrix[3][2]) / w,
		}
	}
	static multMatrixMatrix = (...args) => {
		const len = args[1].length
		let matrix
		for (let m = 1; m < args.length; m++) {
			const m1 = matrix || args[0]
			const m2 = args[m]
			matrix = this.createMatrix(len, len)
			for (let c = 0; c < len; c++) {
				for (let r = 0; r < len; r++) {
					matrix[r][c] = 0
					for (let i = 0; i < len; i++) {
						matrix[r][c] += m1[r][i] * m2[i][c]
					}
				}
			}
		}
		return matrix
	}
}