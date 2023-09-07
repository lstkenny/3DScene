export default class Polygon {
	constructor(vertices, textures, normals) {
		this.vertices = vertices
		this.textures = textures
		this.normals = normals
		this.normal = 0
		this.light = 0
		this.zdist = 0
	}
}