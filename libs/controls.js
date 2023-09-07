class Controls {
	constructor(target) {
		this.target = target || document.body
		this.target.addEventListener("resize", this.resize)
	}
	resize() {
		this.target._bcr = false
	}
	getMousePos(e) {
		if (!this.target._bcr) {
			this.target._bcr = this.target.getBoundingClientRect()
		}
		const coords = e.touches?.[0] || e
		return {
			x: coords.clientX - this.target._bcr.left,
			y: coords.clientY - this.target._bcr.top
		}
	}
	getArguments(event, e) {
		switch (event) {
			case "keydown":
				return [e.code, e]
			case "mousemove":
			case "mousedown":
			case "mouseup":
			case "touchmove":
			case "touchstart":
			case "touchend":
				return [this.getMousePos(e), e]
			default:
				return [e]
		}
	}
	listen(eventsList, callback, target) {
		if (typeof eventsList == "string") {
			eventsList = [eventsList]
		}
		if (!Array.isArray(eventsList)) {
			return
		}
		eventsList.forEach(eventName => 
			(target || this.target).addEventListener(eventName, e => 
				callback.apply(null, 
					this.getArguments(eventName, e)
				)
			)
		)
	}
	keyDown(...args) {
		this.listen("keydown", ...args)
	}
	mouseMove(...args) {
		this.listen(["mousemove", "touchmove"], ...args)
	}
	mouseDown(...args) {
		this.listen(["mousedown", "touchstart"], ...args)
	}
	mouseUp(...args) {
		this.listen(["mouseup", "touchend"], ...args)
	}
	wheel(...args) {
		this.listen(["wheel"], ...args)
	}
	handleTouchStart(pos) {
		this.touchStart = pos
	}
	handleTouchMove(pos, callback) {
		if (!this.touchStart?.x || !this.touchStart?.y) {
			return
		}
		callback({
			x: this.touchStart.x - pos.x,
			y: this.touchStart.y - pos.y,
		})
	}
	swipe(callback, target) {
		this.mouseDown(pos => this.handleTouchStart(pos), target)
		this.mouseMove(pos => this.handleTouchMove(pos, callback, target))
		this.mouseUp(() => this.touchStart = null, document)
	}
}

export default Controls