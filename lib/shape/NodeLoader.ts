import * as d3 from "d3";
import * as Shape from "./shape";
import * as TemplateAPI from "../templateAPI";
import { Node } from "../types/Node";

export default function Node(this: any, data: Node) {
	if (!data.forceSimulation) {
		data.shape.failed = true;
		return null;
	}
	const exists = data.forceSimulation.nodeDataStore.hasNode(data.id);
	const nodeShape = exists ? (d3.select(this) as d3.Selection<SVGElement, any, any, any>) : Shape.create("g");
	const hasChanges = data.forceSimulation.nodeDataStore.hasPayloadChanges(data.id, data);
	const hasTemplateChange = data.forceSimulation.nodeDataStore.hasTemplateChange(data.id, data);
	data.forceSimulation.nodeDataStore.add(data.id, data);

	if (!hasChanges && !hasTemplateChange && !data.shape.failed) return nodeShape.node();
	nodeShape.selectAll("*").remove();
	nodeShape.classed("gly-node", true).attr("data-id", data.id);

	if (!data.shape.template) {
		return throwError(`Template "${data.shape.type}" not found!`);
	}
	try {
		nodeShape
			.append(() => data.shape.template!.shapeBuilder.bind(this)(data, TemplateAPI).node())
			.attr("data-object", "shape");
	} catch (e: any) {
		console.error(e);
		return throwError(e.message);
	}

	data.shape.failed = false;
	Shape.transform(
		nodeShape.select("[data-object=shape]"),
		data.shape.scale * (data.shape.template?.shapeSize ?? 300)
	);
	return nodeShape.node();

	function throwError(this: any, message: string) {
		data.shape.failed = true;
		data.errorMessage = message;
		nodeShape
			.append(() => {
				if (!data.forceSimulation) return null;
				return data.forceSimulation.templateStore.errorTemplate.shapeBuilder
					.bind(this)(data, TemplateAPI)
					.node();
			})
			.attr("data-object", "shape");
		Shape.transform(
			nodeShape.select("[data-object=shape]"),
			data.shape.scale * (data.forceSimulation?.templateStore?.errorTemplate?.shapeSize ?? 300)
		);
		return nodeShape.node();
	}
}
