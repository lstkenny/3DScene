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
		const arr = this.multArrMatrix([vec.x, vec.y, vec.z, 1], matrix)
		const w = arr[3] || 1
		return {
			x: arr[0] / w,
			y: arr[1] / w,
			z: arr[2] / w,
		}
	}
	static multArrMatrix = (arr, matrix) => {
		const len = arr.length
		const res = []
		for (let c = 0; c < len; c++) {
			res[c] = 0
			for (let r = 0; r < len; r++) {
				res[c] += arr[r] * matrix[r][c]
			}
		}
		return res
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