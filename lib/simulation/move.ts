import * as d3 from "d3";
import ForceSimulation from "./forceSimulation";
import { Node } from "../types/Node";

export interface Transform {
	x: number;
	y: number;
	k: number;
}

export interface Boundary {
	x: number;
	y: number;
	width: number;
	height: number;
}

export function moveTo(
	this: ForceSimulation,
	value: Transform | Boundary | Node[],
	onZoom: (t: Transform) => void,
	duration?: number,
	padding?: number
) {
	if (value instanceof Object && "x" in value && "y" in value && "k" in value) {
		return moveToTransform.bind(this)(value, onZoom, duration);
	} else if (value instanceof Object && "x" in value && "y" in value && "width" in value && "height" in value) {
		return moveToBoundary.bind(this)(value, onZoom, duration);
	} else if (value instanceof Array) {
		return moveToNodes.bind(this)(value, onZoom, duration, padding);
	}
}

function moveToTransform(this: ForceSimulation, value: Transform, onZoom: (t: Transform) => void, duration?: number) {
	const svgWidth = this.svgElement.clientWidth;
	const svgHeight = this.svgElement.clientHeight;
	const targetTransform: Transform = {
		x: -value.x + svgWidth / 2 + (svgWidth / 2) * (1 - value.k) * (value.x / (svgWidth / 2)),
		y: -value.y + svgHeight / 2 + (svgWidth / 2) * (1 - value.k) * (value.y / (svgHeight / 2)),
		k: value.k,
	};
	transform.bind(this)(targetTransform, onZoom, duration);
}

function moveToBoundary(this: ForceSimulation, value: Boundary, onZoom: (t: Transform) => void, duration?: number) {
	const svgWidth = this.svgElement.clientWidth;
	const svgHeight = this.svgElement.clientHeight;
	const svgAspectRatio = svgWidth / svgHeight;
	const boundaryAspectRatio = value.width / value.height;
	const scale = svgAspectRatio < boundaryAspectRatio ? svgWidth / value.width : svgHeight / value.height;
	const targetTransform: Transform = {
		x: value.x + value.width / 2,
		y: value.y + value.height / 2,
		k: scale,
	};
	moveToTransform.bind(this)(targetTransform, onZoom, duration);
}

function moveToNodes(
	this: ForceSimulation,
	value: Node[],
	onZoom: (t: Transform) => void,
	duration?: number,
	padding?: number
) {
	const nodes = this.graph.nodes.filter((n) => value.includes(n));
	const bounds = d3.extent(nodes, (n) => n.x);
	const x = d3.extent(nodes, (n) => n.y);
	const width = (bounds[1] ?? 0) - (bounds[0] ?? 0);
	const height = (x[1] ?? 0) - (x[0] ?? 0);
	const largestNodeSize = d3.max(nodes.map((n) => n.shape.scale * (n.shape.template?.shapeSize ?? 300))) ?? 0;

	const targetBoundary: Boundary = {
		x: (bounds[0] ?? 0) - (padding ?? 0) - largestNodeSize / 2,
		y: (x[0] ?? 0) - (padding ?? 0) - largestNodeSize / 2,
		width: width + (padding ?? 0) * 2 + largestNodeSize,
		height: height + (padding ?? 0) * 2 + largestNodeSize,
	};
	moveToBoundary.bind(this)(targetBoundary, onZoom, duration);
}

function transform(this: ForceSimulation, t: Transform, onZoom: (t: Transform) => void, duration?: number) {
	this.selectionGroups.world
		.transition()
		.duration(duration ?? 1000)
		.ease(d3.easePolyInOut)
		.attr("transform", `translate(${t.x},${t.y}) scale(${t.k})`)
		.on("end", () => {
			onZoom(t);
		});
}
