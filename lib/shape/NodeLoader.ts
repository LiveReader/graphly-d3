import * as d3 from "d3";
import * as Shape from "./shape";
import * as TemplateAPI from "../templateAPI";
import { Node } from "../types/Node";

export default function Node(this: any, data: Node) {
	const exists = data.forceSimulation.nodeDataStore.hasNode(data.id);
	const nodeShape = exists ? (d3.select(this) as d3.Selection<SVGElement, any, any, any>) : Shape.create("g");
	const hasChanges = data.forceSimulation.nodeDataStore.hasPayloadChanges(data.id, data);
	const hasTemplateChange = data.forceSimulation.nodeDataStore.hasTemplateChange(data.id, data);

	if (!hasChanges && !hasTemplateChange) return nodeShape.node();
	nodeShape.selectAll("*").remove();
	nodeShape.classed("gly-node", true).attr("data-id", data.id).attr("id", data.id);

	if (
		!data.shape.template ||
		data.shape.template.shapeBuilder == data.forceSimulation.templateStore.errorTemplate.shapeBuilder
	) {
		return throwError(`Template "${data.shape.type}" not found!`);
	}
	try {
		nodeShape
			.append(() => data.shape.template!.shapeBuilder.bind(this)(data, TemplateAPI).node())
			.attr("data-object", "shape");
		data.forceSimulation.nodeDataStore.add(data.id, data);
	} catch (e: any) {
		console.error(e);
		return throwError(e.message);
	}

	return nodeShape.node();

	function throwError(this: any, message: string) {
		data.errorMessage = message;
		nodeShape.append(() =>
			data.forceSimulation.templateStore.errorTemplate.shapeBuilder.bind(this)(data, TemplateAPI).node()
		);
		return nodeShape.node();
	}
}
