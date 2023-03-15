import * as d3 from "d3";
import * as Shape from "./Shape";
import * as TemplateAPI from "../templateAPI";
import { Node } from "../types/Node";

import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });

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

	if (!hasChanges && !hasTemplateChange && !data.shape.failed) {
		Shape.transform(
			nodeShape.select("[data-object=shape]"),
			data.shape.scale * (data.shape.template?.shapeSize ?? 300)
		);
		return nodeShape.node();
	}
	nodeShape.selectAll("*").remove();
	nodeShape.classed("gly-node", true).attr("data-id", data.id);

	if (!data.shape.template) {
		return throwError(`Template "${data.shape.type}" not found!`);
	}

	if (data.shape?.template?.shapePayload) {
		const validate = ajv.compile(data.shape.template.shapePayload);
		const isValid = validate(data.payload);
		if (!isValid) {
			console.error(
				`[graphly-d3] Invalid payload for "${data.shape.type}"\n • ${validate.errors
					?.map((e) => `${e.instancePath} ${e.message}`)
					.join("\n • ")} \n\nTroubleshooting: https://docs.graphly.dev/troubleshooting/`
			);
			return throwError(
				`"${data.shape.type}" ${validate.errors?.[0].instancePath} ${validate.errors?.[0].message}`
			);
		}
	} else {
		console.warn(
			`[graphly-d3] "${data.shape.type}" has no payload schema defined! \n\nIf you are the author of this template, you can find more details here: https://docs.graphly.dev/template-api/shape_payload`
		);
	}

	try {
		nodeShape
			.append(() => data.shape.template!.shapeBuilder.bind(this)(data, TemplateAPI).node())
			.attr("data-object", "shape");
		data.forceSimulation.onZoomRegister
			.filter((r) => r.id.startsWith(data.id))
			.forEach((r) => {
				if (!data.forceSimulation) return;
				r.callback(data.forceSimulation.worldTransform.k);
			});
	} catch (e: any) {
		console.error(
			`[graphly-d3] Template "${data.shape.type}" failed rendering with error: \n${e} \n\nTroubleshooting: https://docs.graphly.dev/troubleshooting/`
		);
		return throwError(e.message);
	}

	const bbox = Shape.getBBox(nodeShape);
	const shapeSize = data.shape.scale * (data.shape.template?.shapeSize ?? 300);
	data.shape.bodyPoints = [];
	const glyBody = nodeShape.select(".gly-body").node() as SVGPathElement;
	const points = [];
	if (glyBody && glyBody.getTotalLength) {
		let n = data.shape?.bodyResolution || 32;
		const totalLength = glyBody.getTotalLength();
		for (let i = 0; i < n; i++) {
			const p = glyBody.getPointAtLength((i / n) * totalLength);
			p.x = Math.round(p.x);
			p.y = Math.round(p.y);
			points.push(p);
		}
		const pointsXmin = Math.min(...points.map((p) => p.x));
		const pointsXmax = Math.max(...points.map((p) => p.x));
		const pointsYmin = Math.min(...points.map((p) => p.y));
		const pointsYmax = Math.max(...points.map((p) => p.y));
		const pointsWidth = pointsXmax - pointsXmin;
		const pointsHeight = pointsYmax - pointsYmin;
		const pointsScale = {
			x: bbox.width / pointsWidth,
			y: bbox.height / pointsHeight,
		};
		points.forEach((p) => {
			p.x = (p.x - pointsXmin) * pointsScale.x + bbox.x - (pointsWidth * pointsScale.x) / 2 + shapeSize;
			p.y = (p.y - pointsYmin) * pointsScale.y + bbox.y - (pointsHeight * pointsScale.y) / 2 + shapeSize;
			if (data.forceSimulation?.debug?.enabled && data.forceSimulation?.debug?.bodyPoints?.enabled) {
				nodeShape
					.select("[data-object=shape]")
					.append("circle")
					.classed("gly-body-points", true)
					.attr("cx", p.x + (pointsWidth * pointsScale.x) / 2 - shapeSize)
					.attr("cy", p.y + (pointsHeight * pointsScale.y) / 2 - shapeSize)
					.attr("r", (Math.max(bbox.height, bbox.width) / shapeSize) * 5)
					.attr("fill", data.forceSimulation?.debug?.bodyPoints?.color)
					.attr("stroke", "none");
			}
		});
		data.shape.bodyPoints = points;
	}

	data.shape.failed = false;
	const transform = Shape.transform(nodeShape.select("[data-object=shape]"), shapeSize);

	for (let p of points) {
		p.x = (p.x - shapeSize) * transform.scale;
		p.y = (p.y - shapeSize) * transform.scale;
	}

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
