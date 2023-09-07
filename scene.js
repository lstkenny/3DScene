import Loop from "./libs/loop.js"
import Vec3d from "./libs/vec3d.js"
import VecMath from "./libs/vecmath.js"
import Controls from "./libs/controls.js"
import Camera from "./libs/camera.js"
import Object3d from "./libs/object3d.js"

function setTiming(key) {
	window.timings || (window.timings = {})
	window.timings[key] = Date.now()
}


class Scene {
	constructor(options) {
		this.camera = new Camera()
		this.models = []
		this.setup = this.setup.bind(this)
		this.update = this.update.bind(this)
		this.controls = new Controls()
		this.setEvents()
		this.createLoop()
	}
	setEvents() {
		this.controls.keyDown(key => {
			switch(key) {
				case "KeyA":
					this.camera.pos.x -= 0.1
					break
				case "KeyD":
					this.camera.pos.x += 0.1
					break
				case "KeyW":
					this.camera.pos.z += 0.1
					break
				case "KeyS":
					this.camera.pos.z -= 0.1
					break
				case "Numpad8":
					this.models.forEach(model => model.aspeed.x -= Math.PI / 1080)
					break
				case "Numpad2":
					this.models.forEach(model => model.aspeed.x += Math.PI / 1080)
					break
				case "Numpad4":
					this.models.forEach(model => model.aspeed.y += Math.PI / 1080)
					break
				case "Numpad6":
					this.models.forEach(model => model.aspeed.y -= Math.PI / 1080)
					break
				case "Numpad7":
					this.models.forEach(model => model.aspeed.z += Math.PI / 1080)
					break
				case "Numpad9":
					this.models.forEach(model => model.aspeed.z -= Math.PI / 1080)
					break
				case "Numpad5": 
					this.models.forEach(model => model.aspeed = new Vec3d())
					break
				case "Space":
					this.loop.frameId ? this.loop.stop() : this.loop.start()
					break
			}
		})
		this.controls.swipe(pos => {
			this.models.forEach(model => {
				model.angle.x = pos.x * Math.PI / 180
				model.angle.y = pos.y * Math.PI / 180
				model.aspeed = VecMath.mult(new Vec3d(pos.x, pos.y, 0), Math.PI / (this.camera.width * 2))
			})
		})
	}
	createLoop() {
		this.loop = new Loop({
			setup: this.setup,
			update: this.update,
		})
	}
	async loadModel(file) {
		const model = new Object3d()
		await model.load(file)
		return model
	}
	getModelDistance(model) {
		// camera distance to fit the object
		const size = model.vertices.reduce((acc, val) => {
			["x", "y", "z"].forEach(axis => {
				if (val[axis] > acc[0]) {
					acc[0] = val[axis]
				}
				if (val[axis] < acc[1]) {
					acc[1] = val[axis]
				}
			})
			return acc
		}, [-Infinity, Infinity])
		return size[0] - size[1] + 1
	}
	async addModel(modelPath) {
		const model = await this.loadModel(modelPath)
		model.pos = new Vec3d(0, 0, this.getModelDistance(model))
		model.angle = new Vec3d(0, 0, 0)
		model.aspeed = new Vec3d(Math.PI / 180, Math.PI / 360, Math.PI / 540)
		// model.size = new Vec3d(1, 1, 1)
		this.models.push(model)
		this.camera.add(model)
	}
	async setup() {
		const models = [
			"./models/hook.obj",
			// "./models/skull.obj",
			// "./models/star.obj",
			// "./models/tree.obj",
			// "./models/scphere.obj",
			// "./models/ship.obj",
			// "./models/icosahedron.obj",
			// "./models/dodecahedron.obj",
			// "./models/octahedron.obj",
			// "./models/cube.obj",
		]
		const loaded = models.map((model, i) => this.addModel(model, i))
		return Promise.all(loaded)
	}
	update(time, tick) {
		setTiming("start")
		this.camera.clear()
		for (let i = 0; i < this.models.length; i++) {
			const model = this.models[i]
			model.angle = VecMath.add(model.angle, model.aspeed)
			// model.size = VecMath.mult(new Vec3d(1, 1, 1), Math.sin(tick * 0.01) + 1)
			model.update()
		}
		this.camera.project()
		setTiming("calculation")
		this.camera.render()
		setTiming("rendering")
		this.camera.showDebugInfo()
	}
}

new Scene()