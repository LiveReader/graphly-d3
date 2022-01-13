import * as Shape from "./Shape";
import * as TemplateAPI from "./TemplateAPI";

/**
 * @param  {object} data data object
 */
function Node(data) {
	const alreadyExists = Shape.alreadyExists(this);
	const node = alreadyExists ? d3.select(this) : Shape.create("g");

	let initialShape = null;
	const changes = Shape.dataChanges(node, data);
	if (!changes) return node.node();
	if (alreadyExists) {
		initialShape = node.select(".shape");
		// node.selectAll("*").remove();
	}

	node.classed("node", true).attr("id", data.id);

	let template = TemplateAPI.get(data.shape.type);
	if (!template || template == TemplateAPI.errorTemplate) {
		return throwError(`Template \"${data.shape.type}\" not founnd`);
	}
	try {
		node.append(() => template.bind(this)(data, initialShape, changes).node()).classed("shape", true);
		Shape.bind(node, data);
	} catch (e) {
		return throwError(e);
	}

	return node.node();

	function throwError(message) {
		console.error(message);
		node.append(() => TemplateAPI.errorTemplate.bind(this)(data).node());
		return node.node();
	}
}

export default Node;
