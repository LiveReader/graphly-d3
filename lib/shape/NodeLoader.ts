import * as d3 from "d3";
import Shape from "./Shape";
import TemplateAPI from "./TemplateAPI";
import * as Template from "../template";

/**
 * @param  {object} data data object
 */
function Node(this: any, data: any) {
	const alreadyExists = Shape.alreadyExists(this);
	const node = alreadyExists ? (d3.select(this) as d3.Selection<SVGElement, any, any, any>) : Shape.create("g");

	let initialShape: d3.Selection<SVGElement, any, any, any> | null = null;
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
	} catch (e: any) {
		console.error(e);
		return throwError(e);
	}

	return node.node();

	function throwError(this: any, message: string) {
		console.log(message);
		node.append(() => TemplateAPI.errorTemplate.bind(this)(data, Template).node());
		return node.node();
	}
}

export default Node;
