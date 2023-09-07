class Sound {
	constructor(config = {}) {
		this.sounds = {}
		this.volume = config.volume || 0.05
	}
	addSound(sound, file) {
		return new Promise((resolve, reject) => {
			try {
				const audio = new Audio(file)
				audio.load()
				audio.addEventListener("canplaythrough", resolve, false)
				this.sounds[sound] = audio
			} catch(e) {
				console.error(e)
				reject(e)
			}
		})
	}
	play(name) {
		const sound = this.sounds[name]
		if (sound) {
			const clone = sound.cloneNode(true)
			clone.volume = this.volume
			clone.play()
		}
	}
}
export default Sound