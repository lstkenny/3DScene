class Color {
	constructor() {
		this.setColor.apply(this, arguments)
	}
	setColor(input) {
		if (Array.isArray(input)) {
			this.fromValues(input)
		} else if (!isNaN(parseInt(input))) {
			this.fromValues(arguments)
		} else if (input.startsWith("#")) {
			this.fromHEX(input)
		} else if (input.toLowerCase().startsWith("rgb")) {
			this.fromRGB(input)
		} else {
			this.fromTitle(input)
		}
	}
	fromValues(values) {
		if (values.length === 1) {
			values = new Array(3).fill(values[0])
		} 
		["r", "g", "b", "a"].forEach((color, index) => {
			if (!values[index]) {
				values[index] = 0
			} else if (values[index] < 1) {
				values[index] = Math.round(values[index] * 255)
			}
			this[color] = parseInt(values[index])
		})
	}
	fromHEX(hex) {
		hex = hex.replace("#", "")
		let digits
		if (hex.length === 8 || hex.length === 4) {
			digits = 4
		} else if (hex.length === 6 || hex.length === 3) {
			digits = 3
		}
		let collen = hex.length / digits
		let fact = [17, 1, 0.062272][collen - 1]
		this.r = Math.round(parseInt(hex.substr(0, collen), 16) * fact) || 0
		this.g = Math.round(parseInt(hex.substr(collen, collen), 16) * fact) || 0
		this.b = Math.round(parseInt(hex.substr(2 * collen, collen), 16) * fact) || 0
		this.a = Math.round(parseInt(hex.substr(3 * collen, collen), 16) * fact) || 0
	}
	fromRGBA(rgba) {
		this.fromRGB(rgba)
	}
	fromRGB(rgb) {
		this.fromValues(rgb.split("(")[1].split(")")[0].split(",").map(x => +x))
	}
	fromTitle(title) {
		const ctx = document.createElement("canvas").getContext("2d")
		ctx.fillStyle = title
		this.fromHEX(ctx.fillStyle)
	}
	colorBetween(color, alpha) {
		if (alpha > 1) {
			alpha = alpha / 255
		}
		let c = []
		c[0] = this.r * (1 - alpha) + (alpha) * color.r
		c[1] = this.g * (1 - alpha) + (alpha) * color.g
		c[2] = this.b * (1 - alpha) + (alpha) * color.b
		return c
	}
	getColorsArray() {
		const colors = [
			this.decToHex(this.r),
			this.decToHex(this.g),
			this.decToHex(this.b),
		]
		if (this.a > 0) {
			colors.push(this.decToHex(this.a))
		}
		return colors
	}
	decToHex(dec) { 
		return parseInt(dec).toString(16).padStart(2, "0")
	}
	toHex() {
		return '#' + this.getColorsArray().join("")
	}
	toRgb() {
		const colors = this.getColorsArray()
		const func = (colors.length > 3) ? "rgba" : "rgb"
		return `${func}(${colors.join(", ")})`
	}
	toRgba() {
		return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")"
	}
}
export default Color