import * as d3 from "d3";
import TemplateStore from "./templateStore";
import NodeDataStore from "./nodeDataStore";

import { Graph } from "../types/Graph";
import { Node } from "../types/Node";
import { Link } from "../types/Link";

import { linkForce, xForce, yForce, gravity, shapeCollide } from "./forces";
import { ticked } from "./ticked";
import { indexLinks, renderNodes, renderLinks } from "./render";
import { createZoom, onZoom } from "./zoom";
import { moveTo, Transform, Boundary, MoveOptions } from "./move";
import { EventStore, Event } from "./eventStore";
import { exportGraph } from "./export";

import "../styles/graph.scss";

interface SelectionGroups {
	world: d3.Selection<SVGGElement, any, any, any>;
	nodes: d3.Selection<SVGGElement, any, any, any>;
	links: d3.Selection<SVGGElement, any, any, any>;
}

export default class ForceSimulation {
	public debug = {
		enabled: false,
		bodyPoints: {
			enabled: true,
			color: "#00ffff",
		},
	};

	private _svgElement: SVGElement;
	get svgElement(): SVGElement {
		return this._svgElement;
	}
	set svgElement(svgElement: SVGElement) {
		this._svgElement = svgElement;
		this._svgSelection = d3.select(svgElement);
		this.selectionGroups = this.createWorld();
		this._zoom = createZoom.bind(this)();
		this.setEvents();
		this.render(this.graph);
	}

	private _svgSelection: d3.Selection<SVGElement, any, any, any>;
	get svgSelection(): d3.Selection<SVGElement, any, any, any> {
		return this._svgSelection;
	}

	private _simulation: d3.Simulation<Node, Link>;
	get simulation(): d3.Simulation<Node, Link> {
		return this._simulation;
	}

	private _selectedNodes: string[] = [];
	get selectedNodes() {
		return this._selectedNodes;
	}
	set selectedNodes(ids: string[]) {
		this._selectedNodes = ids;
		this.selectNodes();
	}

	private _zoom: d3.ZoomBehavior<Element, any>;
	public worldTransform: { x: number; y: number; k: number } = { x: 0, y: 0, k: 1 };
	get worldBounds(): Boundary {
		const { x, y, k } = this.worldTransform;
		const bounds = {
			x: -(x / k),
			y: -(y / k),
			width: this.svgElement.clientWidth / k,
			height: this.svgElement.clientHeight / k,
		};
		return bounds;
	}
	set zoomScaleExtent(extent: [number, number]) {
		this._zoom.scaleExtent(extent);
	}
	set zoomEnabled(enabled: boolean) {
		this._zoom.on("zoom", null);
		if (enabled) this._zoom.on("zoom", ({ transform }) => onZoom.bind(this)(transform));
	}

	private _onZoomRegister: {
		id: string;
		threshold: number;
		callback: (k: number) => boolean;
	}[] = [];
	get onZoomRegister() {
		return this._onZoomRegister;
	}
	private _onZoomRoutines: { [threshold: number]: ((k: number) => boolean)[] } = {};
	get onZoomRoutines() {
		return this._onZoomRoutines;
	}

	set envGravity(value: number) {
		this.simulation.force("gravity", gravity(value));
	}

	set linkDistance(value: number) {
		this.simulation.force("link", linkForce(value));
	}

	public animationDuration: number = 300;
	public draggableNodes: boolean = true;

	public selectionGroups: SelectionGroups;
	public graph: Graph = { nodes: [], links: [] };

	public templateStore: TemplateStore = new TemplateStore();
	public nodeDataStore: NodeDataStore = new NodeDataStore();
	public readonly eventStore: EventStore = new EventStore();

	constructor(svgEl: SVGElement | d3.Selection<SVGElement, any, any, any>) {
		if (svgEl instanceof SVGElement) {
			this._svgElement = svgEl;
			this._svgSelection = d3.select(svgEl);
		} else {
			this._svgSelection = svgEl;
			this._svgElement = svgEl.node() as SVGElement;
		}

		this.worldTransform = { x: this.svgElement.clientWidth / 2, y: this.svgElement.clientHeight / 2, k: 1 };
		this._simulation = this.createSimulation();
		this.selectionGroups = this.createWorld();
		this._zoom = createZoom.bind(this)();
		this.setEvents();
	}

	private createSimulation(): d3.Simulation<Node, Link> {
		const simulation = d3
			.forceSimulation<Node, Link>()
			.force("link", linkForce(400))
			.force("forceX", xForce())
			.force("forceY", yForce())
			.force("gravity", gravity(-10_000))
			.force("shapeCollide", shapeCollide.bind(this))
			.on("tick", ticked.bind(this))
			.on("end", () => {
				this.eventStore.emit(Event.SimulationTickEnd);
			});

		return simulation;
	}

	private createWorld(): SelectionGroups {
		const world = this.svgSelection.append("g").attr("data-object", "world");
		const links = world.append("g").attr("data-object", "links");
		const nodes = world.append("g").attr("data-object", "nodes");
		return { world, nodes, links };
	}

	private setEvents() {
		function pos(this: ForceSimulation, e: any): { x: number; y: number } {
			return {
				x: this.worldBounds.x + e.offsetX / this.worldTransform.k,
				y: this.worldBounds.y + e.offsetY / this.worldTransform.k,
			};
		}
		this.svgSelection.on("click", (e: any) => this.eventStore.emit(Event.EnvironmentClick, e, pos.bind(this)(e)));
		this.svgSelection.on("dblclick", (e: any) =>
			this.eventStore.emit(Event.EnvironmentDoubleClick, e, pos.bind(this)(e))
		);
		this.svgSelection.on("contextmenu", (e: any) =>
			this.eventStore.emit(Event.EnvironmentContextMenu, e, pos.bind(this)(e))
		);
	}

	public registerOnZoom(id: string, threshold: number, callback: (k: number) => boolean) {
		this.deregisterOnZoom(id);
		this._onZoomRegister.push({ id, threshold, callback });
		this.createOnZoomRoutines();
	}

	public deregisterOnZoom(id: string) {
		this._onZoomRegister = this._onZoomRegister.filter(({ id: i }) => i !== id);
	}

	private createOnZoomRoutines() {
		this._onZoomRoutines = {};
		this._onZoomRegister.forEach((registration) => {
			if (!this._onZoomRoutines[registration.threshold]) this._onZoomRoutines[registration.threshold] = [];
			this._onZoomRoutines[registration.threshold].push(registration.callback);
		});
	}

	private selectNodes() {
		this.selectionGroups.nodes.selectAll(".gly-selectable").classed("gly-selected", false);
		this.selectionGroups.nodes
			.selectAll("[data-object='node']")
			.filter((d: any) => this.selectedNodes.includes((d as Node).id))
			.selectAll(".gly-selectable")
			.classed("gly-selected", true);
	}

	public async render(this: ForceSimulation, graph: Graph, alpha: number = 0.05, forced: boolean = false) {
		if (forced) {
			this.nodeDataStore.clear();
			this.selectionGroups.nodes.selectAll("*").remove();
			this.selectionGroups.links.selectAll("*").remove();
		}
		this.graph = graph;
		await renderNodes
			.bind(this)(this.graph)
			.then(() => {
				indexLinks(graph);
				renderLinks.bind(this)(this.graph);

				this.simulation.nodes(this.graph.nodes);
				(this.simulation.force("link") as d3.ForceLink<Node, Link>).links(graph.links);
				this.simulation.alphaTarget(alpha).restart();
				setTimeout(() => {
					this.simulation.alphaTarget(0);
				}, 100);

				this.selectNodes();
			});
	}

	public exportGraph() {
		return exportGraph.bind(this)();
	}

	public moveTo(options: MoveOptions) {
		moveTo.bind(this)(options, (t: Transform) => {
			this.svgSelection.call((this._zoom as any).transform, d3.zoomIdentity.translate(t.x, t.y).scale(t.k));
		});
	}

	public on(event: string, callback: (...args: any[]) => void) {
		this.eventStore.on(event, callback);
	}
}
