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

export interface MoveOptions {
	transform?: Transform;
	boundaries?: Boundary[];
	nodes?: Node[];
	duration?: number;
	padding?: number;
}

export function moveTo(this: ForceSimulation, options: MoveOptions, onZoom: (t: Transform) => void) {
	if (options.transform) {
		return moveToTransform.bind(this)(options.transform, onZoom, options.duration);
	}
	const boundaries: Boundary[] = [];
	if (options.boundaries) {
		boundaries.push(cumulatedBoundary(options.boundaries));
	}
	if (options.nodes) {
		boundaries.push(nodesBoundary(options.nodes));
	}
	moveToBoundary.bind(this)(cumulatedBoundary(boundaries), onZoom, options.duration, options.padding);
}

function cumulatedBoundary(boundaries: Boundary[]): Boundary {
	let minX: number = boundaries.reduce((acc, b) => Math.min(acc, b.x), Infinity);
	let minY: number = boundaries.reduce((acc, b) => Math.min(acc, b.y), Infinity);
	let maxX: number = boundaries.reduce((acc, b) => Math.max(acc, b.x + b.width), -Infinity);
	let maxY: number = boundaries.reduce((acc, b) => Math.max(acc, b.y + b.height), -Infinity);
	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY,
	};
}

function nodesBoundary(nodes: Node[]): Boundary {
	const bounds = d3.extent(nodes, (n) => n.x);
	const x = d3.extent(nodes, (n) => n.y);
	const width = (bounds[1] ?? 0) - (bounds[0] ?? 0);
	const height = (x[1] ?? 0) - (x[0] ?? 0);
	const largestNodeSize = d3.max(nodes.map((n) => n.shape.scale * (n.shape.template?.shapeSize ?? 300))) ?? 0;
	return {
		x: (bounds[0] ?? 0) - largestNodeSize / 2,
		y: (x[0] ?? 0) - largestNodeSize / 2,
		width: width + largestNodeSize,
		height: height + largestNodeSize,
	};
}

function moveToTransform(this: ForceSimulation, t: Transform, onZoom: (t: Transform) => void, duration?: number) {
	const svgWidth = this.svgElement.clientWidth;
	const svgHeight = this.svgElement.clientHeight;
	const centerOffset = { x: svgWidth / 2, y: svgHeight / 2 };
	const targetTransform: Transform = {
		x: -t.x + (svgWidth / 2) * (1 - t.k) * (t.x / (svgWidth / 2)) + centerOffset.x,
		y: -t.y + (svgHeight / 2) * (1 - t.k) * (t.y / (svgHeight / 2)) + centerOffset.y,
		k: t.k,
	};
	transform.bind(this)(targetTransform, onZoom, duration);
}

function moveToBoundary(
	this: ForceSimulation,
	boundary: Boundary,
	onZoom: (t: Transform) => void,
	duration?: number,
	padding?: number
) {
	const svgWidth = this.svgElement.clientWidth;
	const svgHeight = this.svgElement.clientHeight;
	const svgAspectRatio = svgWidth / svgHeight;
	const boundaryAspectRatio = (boundary.width + (padding ?? 0) * 2) / (boundary.height + (padding ?? 0) * 2);
	const scale =
		svgAspectRatio < boundaryAspectRatio
			? svgWidth / (boundary.width + (padding ?? 0) * 2)
			: svgHeight / (boundary.height + (padding ?? 0) * 2);
	const targetTransform: Transform = {
		x: boundary.x + boundary.width / 2,
		y: boundary.y + boundary.height / 2,
		k: scale,
	};
	moveToTransform.bind(this)(targetTransform, onZoom, duration);
}

function transform(this: ForceSimulation, t: Transform, onZoom: (t: Transform) => void, duration?: number) {
	if (isNaN(t.x) || isNaN(t.y) || isNaN(t.k)) return;
	this.selectionGroups.world
		.transition()
		.duration(duration ?? 1000)
		.ease(d3.easePolyInOut)
		.attr("transform", `translate(${t.x},${t.y}) scale(${t.k})`)
		.on("end", () => {
			onZoom(t);
		});
}
