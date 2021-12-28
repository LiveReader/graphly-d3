const Templates = {
	add(id, shape) {
		if (!Templates[id]) {
			Templates[id] = shape;
		}
		return this;
	}
}

class NodeFactory {
	constructor(simulation, data, shapeSize = 100) {
		this.simulation = simulation;
		this.data = data;
		this.shapeSize = shapeSize;
	}

	render() {
		this.data.select((d) => {
			const currentNode = this.data.filter((el) => el.id === d.id);
			const template = Templates[d.shape.type];
			if (!template) {
				console.error(`Template \"${d.shape.type}\" not founnd`);
				return;
			}
			try {
				new template(this.simulation, currentNode, this.shapeSize).render()
			} catch (e) {
				console.error(e);
			}
		});
	}
}
