import * as d3 from "d3";
import Shape from "./Shape";
import TemplateStore from "../templateStore";
import * as TemplateAPI from "../templateAPI";
import { Node } from "../types/Node";

/**
 * @param  {object} data data object
 */
function Node(this: any, data: Node) {
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

	if (!data.shape.template || data.shape.template.shapeBuilder == TemplateStore.errorTemplate.shapeBuilder) {
		return throwError(`Template "${data.shape.type}" not found!`, initialShape);
	}
	try {
		node.append(() =>
			data.shape.template!.shapeBuilder.bind(this)(data, initialShape, changes, TemplateAPI).node()
		).classed("shape", true);
		Shape.bind(node, data);
	} catch (e: any) {
		console.error(e);
		return throwError(e.message, initialShape);
	}

	return node.node();

	function throwError(this: any, message: string, initialShape: d3.Selection<SVGElement, any, any, any> | null) {
		data.errorMessage = message;
		node.append(() =>
			TemplateStore.errorTemplate.shapeBuilder.bind(this)(data, initialShape, null, TemplateAPI).node()
		);
		return node.node();
	}
}

export default Node;
