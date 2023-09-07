import Vec3d from "./vec3d.js"
import VecMath from "./vecmath.js"

export default class Camera {
	constructor(options) {
		Object.assign(this, {
			pos: new Vec3d(0, 0, 0),
			light: VecMath.normal((new Vec3d(-1, -1, -1))),
			width: window.innerWidth,
			height: window.innerHeight - 5,
			fov: 90,
			maxDist: 1000,
			minDist: 0.1,
			vertices: [],
			projected: [],
			polygons: [],
			info: {},
		}, options)
		this.createCanvas()
		this.createProjectionMatrix()
	}
	createCanvas() {
		this.cnv = document.createElement("canvas")
		this.cnv.width = this.width
		this.cnv.height = this.height
		document.body.appendChild(this.cnv)
		this.ctx = this.cnv.getContext("2d")
	}
	createProjectionMatrix() {
		// camera settings
		const fovRad = 1 / Math.tan(this.fov * 0.5 / 180 * Math.PI)
		const aspect = this.height / this.width
		// projection matrix
		this.pm = [
			[aspect * fovRad, 0, 0, 0],
			[0, fovRad, 0, 0],
			[0, 0, this.maxDist / (this.maxDist - this.minDist), 1],
			[0, 0, (-this.maxDist * this.minDist) / (this.maxDist - this.minDist), 0],
		]
		return this.pm
	}
	add(model) {
		// add vertices to the camera
		const vi = this.vertices.length
		for (let i = 0; i < model.vertices.length; i++) {
			this.vertices[i + vi] = model.vertices[i]
		}
		// add polygons to the camera
		const pi = this.polygons.length
		for (let i = 0; i < model.polygons.length; i++) {
			const polygon = model.polygons[i]
			this.polygons[i + pi] = {
				vertices: []
			}
			for (let j = 0; j < polygon.vertices.length; j++) {
				this.polygons[i + pi].vertices[j] = polygon.vertices[j] + vi
			}
		}
	}
	project() {
		// calculate polygons normals, lights and z-distances
		for (let i = 0; i < this.polygons.length; i++) {
			const polygon = this.polygons[i]
			const line1 = VecMath.sub(this.vertices[polygon.vertices[1]], this.vertices[polygon.vertices[0]])
			const line2 = VecMath.sub(this.vertices[polygon.vertices[2]], this.vertices[polygon.vertices[0]])
			const normal = VecMath.normal(VecMath.cross(line1, line2))
			const sub = VecMath.sub(this.vertices[polygon.vertices[0]], this.pos)
			this.polygons[i].normal = VecMath.dot(normal, sub)
			this.polygons[i].light = VecMath.dot(normal, this.light)
			this.polygons[i].zdist = 0
			for (let j = 0; j < polygon.vertices.length; j++) {
				this.polygons[i].zdist += this.vertices[polygon.vertices[j]].z / polygon.vertices.length
			}
		}
		// sort polygons by z-distances
		this.polygons.sort((a, b) => {
			if (a.zdist < b.zdist) {
				return 1
			} else {
				return -1
			}
		})
		// project vertices to 2d plane
		for (let i = 0; i < this.vertices.length; i++) {
			let vertex = VecMath.clone(this.vertices[i])
			vertex = VecMath.multVecMatrix(vertex, this.pm)
			vertex = VecMath.add(vertex, new Vec3d(1, 1))
			vertex = VecMath.scale(vertex, new Vec3d(this.width / 2, this.height / 2))
			this.projected[i] = vertex
		}
	}
	clear() {
		this.ctx.fillStyle = "black"
		this.ctx.fillRect(0, 0, this.width, this.height)
	}
	showDebugInfo() {
		const time = Date.now()
		this.lastTime || (this.lastTime = time - 60)
		const delta = time - this.lastTime
		const fps = Math.round(1000 / delta)
		this.ctx.fillStyle = "white"
		this.ctx.fillText(`fps: ${fps}`, 10, 20)
		this.ctx.fillText(`vertices: ${this.vertices.length}`, 10, 30)
		this.ctx.fillText(`polygons: ${this.polygons.length}`, 10, 40)
		this.ctx.fillText(`visible: ${this.info.visible}`, 10, 50)
		const keys = Object.keys(window.timings)
		const total = (window.timings[keys[keys.length - 1]] - window.timings[keys[0]]) || 1
		for (let i = 1; i < keys.length; i++) {
			const ms = window.timings[keys[i]] - window.timings[keys[i - 1]]
			this.ctx.fillText(`${keys[i]}: ${ms} (${Math.round(ms / total * 100)}%)`, 10, 50 + i * 10)
		}
		this.lastTime = time
	}
	render() {
		this.info.visible = 0
		for (let i = 0; i < this.polygons.length; i++) {
			const polygon = this.polygons[i]
			if (polygon.normal > 0) {
				// normal
				continue
			}
			this.info.visible++
			const shade = Math.round((polygon.light + 1) * 255 / 2)
			const rgb = `rgb(${shade},${shade},${shade})`
			this.ctx.strokeStyle = rgb
			this.ctx.fillStyle = rgb
			this.ctx.beginPath()
			for (let j = 0; j < polygon.vertices.length; j++) {
				const vertex = this.projected[polygon.vertices[j]]
				if (!vertex) {
					continue
				}
				if (j) {
					this.ctx.lineTo(vertex.x, vertex.y)
				} else {
					this.ctx.moveTo(vertex.x, vertex.y)
				}
			}
			this.ctx.closePath()
			this.ctx.stroke()
			this.ctx.fill()
		}
	}
}