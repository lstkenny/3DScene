import Vec3d from "./vec3d.js"
import VecMath from "./vecmath.js"
import Polygon from "./polygon.js"

export default class Object3d {
	constructor() {
		// reset object data
		this.reset()
	}
	async load(file) {
		// reset object data
		this.reset()
		// load obj file
		const response = await fetch(file)
		const data = await response.text()
		// read obj data
		data.split("\n").forEach(line => {
			const data = line.trim().split(/\s+/)
			// vertices
			if (data[0] === "v") {
				this.vertices.push(new Vec3d(data[1], data[2], data[3]))
			}
			// textures
			if (data[0] === "vt") {
				this.textures.push(new Vec3d(data[1], data[2]))
			}
			// normales
			if (data[0] === "vn") {
				this.normals.push(new Vec3d(data[1], data[2], data[3]))
			}
			// faces
			if (data[0] === "f") {
				const vertices = []
				const textures = []
				const normals = []
				for (let i = 1; i < data.length; i++) {
					const items = data[i].trim().split("/").map(index => Number(index) - 1)
					vertices.push(items[0])
					textures.push(items[1] || null)
					normals.push(items[2] || null)
				}
				this.polygons.push(new Polygon(vertices, textures, normals))
			}
		})
		// save original vertices
		this.save()
	}
	reset() {
		// reset object data
		this.vertices = []
		this.textures = []
		this.normals = []
		this.polygons = []
		// original vertices
		this.saved = []
	}
	save() {
		for (let i = 0; i < this.vertices.length; i++) {
			this.saved[i] = VecMath.clone(this.vertices[i])
		}
	}
	restore() {
		for (let i = 0; i < this.saved.length; i++) {
			// do not override "this.vertices" elements, because they can be used as references
			VecMath.update(this.vertices[i], this.saved[i])
		}
	}
	getIdentityMatrix() {
		return [
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1],
		]
	}
	getRotationMatrix(vec) {
		const sin = VecMath.sin(vec)
		const cos = VecMath.cos(vec)
		return VecMath.multMatrixMatrix([
			[1, 0, 0, 0],
			[0, cos.x, sin.x, 0],
			[0, -sin.x, cos.x, 0],
			[0, 0, 0, 1],
		], [
			[cos.y, 0, -sin.y, 0],
			[0, 1, 0, 0],
			[sin.y, 0, cos.y, 0],
			[0, 0, 0, 1],
		], [
			[cos.z, sin.z, 0, 0],
			[-sin.z, cos.z, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 1],
		])	
	}
	getTranslationMatrix(vec) {
		return [
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 1, 0],
			[vec.x, vec.y, vec.z, 1],
		]
	}
	getResizeMatrix(vec) {
		return [
			[vec.x, 0, 0, 0],
			[0, vec.y, 0, 0],
			[0, 0, vec.z, 0],
			[0, 0, 0, 1],
		]
	}
	getVertex(polygon, index) {
		return this.vertices[polygon.vertices[index]]
	}
	update() {
		let transformMatrix = this.getIdentityMatrix()
		if (this.size) {
			// make size transformation
			transformMatrix = VecMath.multMatrixMatrix(transformMatrix, this.getResizeMatrix(this.size))
		}
		if (this.angle) {
			// rotation
			transformMatrix = VecMath.multMatrixMatrix(transformMatrix, this.getRotationMatrix(this.angle))
		}
		if (this.pos) {
			// translation
			transformMatrix = VecMath.multMatrixMatrix(transformMatrix, this.getTranslationMatrix(this.pos))
		}
		for (let i = 0; i < this.saved.length; i++) {
			// do not override "this.vertices" elements, because they can be used as references
			VecMath.update(this.vertices[i], VecMath.multVecMatrix(this.saved[i], transformMatrix))
		}
	}
}