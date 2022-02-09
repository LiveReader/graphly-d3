import * as d3 from "d3";
import Shape from "./Shape.js";
import TemplateAPI from "./TemplateAPI.js";
import * as Template from "../template.js";

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

	if (!data.shape.template || data.shape.template == TemplateAPI.errorTemplate) {
		return throwError(`Template "${data.shape.type}" not founnd`);
	}
	try {
		node.append(() => data.shape.template.bind(this)(data, initialShape, changes, Template).node()).classed(
			"shape",
			true
		);
		Shape.bind(node, data);
	} catch (e) {
		return throwError(e);
	}

	return node.node();

	function throwError(message) {
		node.append(() => TemplateAPI.errorTemplate.bind(this)(data, Template).node());
		return node.node();
	}
}

export default Node;
