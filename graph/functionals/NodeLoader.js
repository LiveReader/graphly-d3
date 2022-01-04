const Templates = {
	/**
	 * @param  {string} id template id
	 * @param  {function} shape template shape
	 */
	add(id, shape) {
		if (!Templates[id]) {
			Templates[id] = shape;
		}
		return this;
	},
};

/**
 * @param  {object} data data object
 */
function Node(data) {
	const alreadyExists = Shape.alreadyExists(this);
	const node = alreadyExists ? d3.select(this) : Shape.create("g");

	let initialShape = null;
	if (!Shape.dataChanged(node, data)) return node.node();
	if (alreadyExists) {
		initialShape = node.select(".shape");
		// node.selectAll("*").remove();
	}

	node.classed("node", true).attr("id", data.id);

	let template = Templates[data.shape.type];
	if (!template) {
		return throwError(`Template \"${data.shape.type}\" not founnd`);
	}
	try {
		node.append(() => template.bind(this)(data, initialShape).node()).classed("shape", true);
	} catch (e) {
		return throwError(e);
	}

	return node.node();

	function throwError(message) {
		console.error(message);
		node.append(() => ErrorNode.bind(this)(data));
		return node.node();
	}
}

/**
 * @param  {object} data data object
 */
function ErrorNode(data) {
	const shape = Shape.create("g");
	shape.append("circle").attr("r", 100).attr("fill", "#ff4040");
	return shape.node();
}
