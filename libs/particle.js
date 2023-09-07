import { Vec2 } from "./vec2.js"

class Particle {
	constructor(data) {
		this.size = data.size || 1
		if (data.vertices) {
			this.setVertices(data.vertices)
		}
		this.setColor(data.color || "#fff")
		this.pos = new Vec2(data.x || 0, data.y || 0)
		this.vel = new Vec2(data.xv || 0, data.yv || 0)
		this.acc = new Vec2(0, 0)
		this.avel = data.av || 0
		this.angle = data.angle || 0
	}
	setColor(input) {
		if (input.substr(0, 1) == "#") {
			//	hex color
			var collen = (input.length - 1) / 3
			var fact = [17, 1, 0.062272][collen - 1]
			this.color = {
				"r": Math.round(parseInt(input.substr(1, collen), 16) * fact),
				"g": Math.round(parseInt(input.substr(1 + collen, collen), 16) * fact),
				"b": Math.round(parseInt(input.substr(1 + 2 * collen, collen), 16) * fact),
				"a": 1
			};
		} else {
			let schema = [
				["r", 255],
				["g", 255],
				["b", 255],
				["a", 1]
			];
			input = input.split("(")[1].split(")")[0].split(",").map(x => +x)
			let result = {}
			for (let i = 0; i < 4; i++) {
				if (typeof input[i] == 'undefined') {
					input[i] = schema[i][1]
				}
				result[schema[i][0]] = input[i]
			}
			this.color = result
		}
	}
	setVertices(vertices) {
		if (Array.isArray(vertices)) {
			this.vertices = vertices
		} else if (vertices = parseInt(vertices)) {
			this.vertices = []
			for (let i = 0; i < vertices; i++) {
				this.vertices.push({
					"a": Math.PI * 2 * i / vertices,
					"r": (Math.random() - 0.5) * this.size + this.size
				})
			}
		}
	}
	force(force) {
		this.acc.add(force)
	}
	update() {
		this.vel.add(this.acc)
		this.pos.add(this.vel)
		this.acc.mult(0)
		this.angle += this.avel
	}
	draw(ctx) {
		ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`
		ctx.save()
		ctx.translate(this.pos.x, this.pos.y)
		ctx.beginPath()
		if (this.vertices) {
			ctx.rotate(this.angle)
			let lastV = this.vertices[this.vertices.length - 1]
			ctx.moveTo(
				lastV.r * Math.cos(lastV.a), 
				lastV.r * Math.sin(lastV.a)
			)
			this.vertices.forEach(vertex => {
				ctx.lineTo(
					vertex.r * Math.cos(vertex.a),
					vertex.r * Math.sin(vertex.a)
				)
			})
		} else {
			ctx.arc(0, 0, this.size, 0, 2 * Math.PI)
		}
		ctx.fill()
		ctx.restore()
	}
}
export default Particle