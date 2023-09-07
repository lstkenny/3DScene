class Matrix {
	constructor(cols, rows) {
		this.cols = cols
		this.rows = rows
		this.cells = new Array(cols * rows)
	}
	invalidPos(col, row) {
		return (
			col < 0 ||
			col >= this.cols ||
			row < 0 || 
			row >= this.rows
		)
	}
	indexFromPos(col, row) {
		if (this.invalidPos(col, row)) {
			return null
		}
		return col + row * this.cols
	}
	indexToPos(index) {
		const col = index % this.cols
		const row = Math.floor(index / this.cols)
		if (this.invalidPos(col, row)) {
			return null
		}
		return { col, row }
	}
	fromArray(array) {
		if (Array.isArray(array[0])) {
			this.update((col, row) => array[col][row])
		} else {
			this.update((col, row, value, i) => array[i])
		}
	}
	forEach(callback) {
		for (let i = 0; i < this.cells.length; i++) {
			const { col, row } = this.indexToPos(i)
			callback.call(this, col, row, this.cells[i], i)
		}
	}
	update(callback) {
		for (let i = 0; i < this.cells.length; i++) {
			const { col, row } = this.indexToPos(i)
			this.cells[i] = callback.call(this, col, row, this.cells[i], i)
		}
	}
	flip(axis) {
		if (axis !== "x"  && axis !== "y") {
			return
		}
		const cells = new Array(this.cols * this.rows)
		this.forEach((col, row, value, i) => {
			const _col = (axis === "x") ? col : this.cols - 1 - col
			const _row = (axis === "y") ? row : this.rows - 1 - row
			const _i = this.indexFromPos(_col, _row)
			cells[_i] = value
		})
		this.fromArray(cells)
	}
	shuffle() {
		for (let i = 0; i < this.cells.length; i++) {
			const j = Math.floor(Math.random() * this.cells.length)
			const buff = this.cells[i]
			this.cells[i] = this.cells[j]
			this.cells[j] = buff
		}
	}
	transpose() {
		const cells = new Array(this.cols * this.rows)
		this.forEach((col, row, value, i) => {
			const _i = this.indexFromPos(row, col)
			cells[_i] = value
		})
		const buff = this.cols
		this.cols = this.rows
		this.rows = buff
		this.fromArray(cells)
	}
	rotate(dir) {
		if (dir !== "cw" && dir !== "ccw") {
			return
		}
		const flips = {
			cw: "y",
			ccw: "x"
		}
		this.transpose()
		this.flip(flips[dir])
	}
	find(callback) {
		if (typeof callback !== "function") {
			const value = callback
			callback = element => value === element
		}
		for (let i = 0; i < this.cells.length; i++) {
			if (callback(this.cells[i])) {
				return this.indexToPos(i)
			}
		}
	}
	set(col, row, value) {
		const index = this.indexFromPos(col, row)
		if (index !== null) {
			this.cells[index] = value
		}
	}
	get(col, row) {
		return this.cells[this.indexFromPos(col, row)]
	}
}

export default Matrix