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
		moveToTransform.bind(this)(options, onZoom);
	} else if (options.boundaries) {
		moveToBoundaries.bind(this)(options, onZoom);
	} else if (options.nodes) {
		moveToNodes.bind(this)(options, onZoom);
	}
}

function moveToTransform(this: ForceSimulation, options: MoveOptions, onZoom: (t: Transform) => void) {
	const value = options.transform;
	if (!value) return;
	const svgWidth = this.svgElement.clientWidth;
	const svgHeight = this.svgElement.clientHeight;
	const targetTransform: Transform = {
		x: -value.x + svgWidth / 2 + (svgWidth / 2) * (1 - value.k) * (value.x / (svgWidth / 2)),
		y: -value.y + svgHeight / 2 + (svgWidth / 2) * (1 - value.k) * (value.y / (svgHeight / 2)),
		k: value.k,
	};
	transform.bind(this)(targetTransform, onZoom, options.duration);
}

function moveToBoundaries(this: ForceSimulation, options: MoveOptions, onZoom: (t: Transform) => void) {
	const value = options.boundaries;
	if (!value) return;
	let xMin: number = Infinity;
	let xMax: number = -Infinity;
	let yMin: number = Infinity;
	let yMax: number = -Infinity;
	for (const b of value) {
		xMin = Math.min(xMin, b.x);
		xMax = Math.max(xMax, b.x + b.width);
		yMin = Math.min(yMin, b.y);
		yMax = Math.max(yMax, b.y + b.height);
	}
	const containerBounds: Boundary = {
		x: xMin - (options.padding ?? 0),
		y: yMin - (options.padding ?? 0),
		width: xMax - xMin + (options.padding ?? 0) * 2,
		height: yMax - yMin + (options.padding ?? 0) * 2,
	};

	const svgWidth = this.svgElement.clientWidth;
	const svgHeight = this.svgElement.clientHeight;
	const svgAspectRatio = svgWidth / svgHeight;
	const boundaryAspectRatio = containerBounds.width / containerBounds.height;
	const scale =
		svgAspectRatio < boundaryAspectRatio ? svgWidth / containerBounds.width : svgHeight / containerBounds.height;
	const targetTransform: Transform = {
		x: containerBounds.x + containerBounds.width / 2,
		y: containerBounds.y + containerBounds.height / 2,
		k: scale,
	};
	moveToTransform.bind(this)(
		{
			transform: targetTransform,
			duration: options.duration,
		},
		onZoom
	);
}

function moveToNodes(this: ForceSimulation, options: MoveOptions, onZoom: (t: Transform) => void) {
	const value = options.nodes;
	if (!value) return;
	const nodes = this.graph.nodes.filter((n) => value.includes(n));
	const bounds = d3.extent(nodes, (n) => n.x);
	const x = d3.extent(nodes, (n) => n.y);
	const width = (bounds[1] ?? 0) - (bounds[0] ?? 0);
	const height = (x[1] ?? 0) - (x[0] ?? 0);
	const largestNodeSize = d3.max(nodes.map((n) => n.shape.scale * (n.shape.template?.shapeSize ?? 300))) ?? 0;

	const targetBoundary: Boundary = {
		x: (bounds[0] ?? 0) - largestNodeSize / 2,
		y: (x[0] ?? 0) - largestNodeSize / 2,
		width: width + largestNodeSize,
		height: height + largestNodeSize,
	};
	moveToBoundaries.bind(this)(
		{
			boundaries: [targetBoundary],
			duration: options.duration,
			padding: options.padding,
		},
		onZoom
	);
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
