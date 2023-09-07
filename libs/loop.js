class Loop {
	constructor(options = {}) {
		Object.assign(this, {
			fps: 60,
			update: null,
			lastFrameTime: 0,
			delta: 0,
			tick: 0,
			frameId: null,
			autoStart: true,
		}, options)
		this.frameRate = 1 / this.fps
		this.onUpdate = this.onUpdate.bind(this)
		this.onSetup()
	}
	async onSetup() {
		await this?.setup()
		if (this.autoStart) {
			this.start()
		}
	}
	onUpdate(currentFrameTime) {
		if (this.lastFrameTime !== null) {
			this.delta += (currentFrameTime - this.lastFrameTime) / 1000
			if (this.delta > this.frameRate) {
				this?.update(currentFrameTime + this.delta, this.tick)
				this.tick++
				this.delta -= this.frameRate
			}
		}
		this.lastFrameTime = currentFrameTime
		if (this.frameId) {
			this.frameId = requestAnimationFrame(this.onUpdate)
		}
	}
	start() {
		this.lastFrameTime = null
		this.frameId = requestAnimationFrame(this.onUpdate)
	}
	stop() {
		cancelAnimationFrame(this.frameId)
		this.frameId = null
	}
}
export default Loop