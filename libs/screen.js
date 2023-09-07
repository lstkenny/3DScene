import DataSet from "./dataset.js"
import Color from "./color.js"

class Screen extends DataSet {

	constructor(config) {
		super()
		this.setConfig(config)
		this.init()
	}
	setConfig(config) {
		this.set("config", Object.assign({
			"container": "body",
			"imageRendering": "auto",
			"width": 100,
			"height": 100,
			"size": 5,
		}, config))
	}
	init() {
		this.setCanvas()
		this.setLayer(0)
		this.set("stroke", "#000")
		this.set("fill", "#fff")
	}
	setCanvas() {
		this.cnv = document.createElement("canvas")
		this.cnv.width = this.get("config.width")
		this.cnv.height = this.get("config.height")
		this.cnv.style.width = this.get("config.width") * this.get("config.size") + "px"
		this.cnv.style.height = this.get("config.height") * this.get("config.size") + "px"
		this.cnv.style.imageRendering = this.get("config.imageRendering", "auto")
		this.ctx = this.cnv.getContext("2d")
		document.querySelector(this.config.container).appendChild(this.cnv)
	}
	setLayer(layer) {
		this.set("layer", parseInt(layer))
	}
	setStroke(color) {
		this.ctx.strokeStyle = color || this.get("stroke")
	}
	setFill(color) {
		this.ctx.fillStyle = color || this.get("fill")
	}
	clear() {
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height)
	}
	line(x1, y1, x2, y2, color = false) {
		this.setStroke(color)
		this.ctx.beginPath()
		this.ctx.moveTo(x1, y1)
		this.ctx.lineTo(x2, y2)
		this.ctx.closePath()
		this.ctx.stroke()
		this.setStroke(false)
	}
	polygon(vertices, color = false, fill = false, closed = false) {
		this.setStroke(color)
		this.setFill(fill || color)
		this.ctx.beginPath()
		vertices.forEach((vertex, index) => {
			if (index) {
				this.ctx.lineTo(vertex.x, vertex.y)
			} else {
				this.ctx.moveTo(vertex.x, vertex.y)
			}
		})
		if (closed) {
			// this.ctx.lineTo(vertices[0].x, vertices[0].y)
			this.ctx.closePath()
		}
		this.ctx.stroke()
		this.ctx.fill()
		this.setStroke(false)
		this.setFill(false)
	}
	rect(x, y, w, h, stroke = false, fill = false) {
		x = Math.round(x) - 0.5
		y = Math.round(y) - 0.5
		this.setStroke(stroke)
		this.setFill(fill || stroke)
		this.ctx.beginPath()
		this.ctx.rect(x, y, w, h)
		this.ctx.closePath()
		this.ctx.stroke()
		this.ctx.fill()
		this.setStroke(false)
		this.setFill(false)
	}
	point(x, y, stroke) {
		this.rect(x, y, 1, 1, stroke)
	}
	ellipse(x, y, rx, ry, stroke = false, fill = false) {
		this.setStroke(stroke)
		this.setFill(fill || stroke)
		this.ctx.beginPath()
		this.ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI, false)
		this.ctx.closePath()
		this.ctx.stroke()
		this.ctx.fill()
		this.setStroke(false)
		this.setFill(false)
	}
	circle(x, y, r, stroke = false, fill = false) {
		this.ellipse(x, y, r, r, stroke, fill)
	}
	draw(shape) {
		if (shape.vertices) {
			this.polygon(shape.vertices, shape.color, shape.background, shape.closed)
		} else if (shape.line) {
			this.line(shape.line[0].x, shape.line[0].y, shape.line[1].x, shape.line[1].y, shape.color)
		} else if (shape.rect) {
			this.rect(shape.rect.pos.x, shape.rect.pos.y, shape.rect.size.x, shape.rect.size.y, shape.color, shape.background)
		} else if (shape.ellipse) {
			if (typeof shape.ellipse.size == "number") {
				shape.ellipse.size = {
					"x": shape.ellipse.size,
					"y": shape.ellipse.size
				}
			}
			this.ellipse(shape.ellipse.pos.x, shape.ellipse.pos.y, shape.ellipse.size.x, shape.ellipse.size.y, shape.color, shape.background)
		}
	}
	text(text, x, y, fill = false) {
		this.setFill(fill)
		this.ctx.fillText(text, x, y)
		this.setFill(false)
	}
	image(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
		this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
	}
}
export default Screen