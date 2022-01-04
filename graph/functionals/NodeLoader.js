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
	const node = Shape.create("g");
	node.classed("node", true).attr("id", data.id);

	let template = Templates[data.shape.type];
	if (!template) {
		return throwError(`Template \"${data.shape.type}\" not founnd`);
	}
	try {
		template = template.bind(this);
		node.append(() => template(data));
	} catch (e) {
		return throwError(e);
	}

	return node.node();

	function throwError(message) {
		console.error(message);
		const errorNode = ErrorNode.bind(this);
		node.append(() => errorNode(data));
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
