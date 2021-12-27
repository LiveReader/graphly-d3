class NodeFactory {
	constructor(simulation, data, shapeSize = 100) {
		this.simulation = simulation;
		this.data = data;
		this.shapeSize = shapeSize;
	}

	render() {
		this.data.select((d) => {
			const currentNode = this.data.filter((el) => el.id === d.id);
			new d.shape.type(this.simulation, currentNode, this.shapeSize).render();
		});
	}
}
