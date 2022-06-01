import * as d3 from "d3";

import { Node } from "../types/Node";
import { Link } from "../types/Link";

import { linkForce, xForce, yForce, gravity, circleCollide } from "./forces";

export default class ForceSimulation {
	private _svgElement: SVGElement;
	get svgElement(): SVGElement {
		return this._svgElement;
	}
	set svgElement(svgElement: SVGElement) {
		this._svgElement = svgElement;
	}

	private _svgSelection: d3.Selection<SVGElement, any, any, any>;
	get svgSelection(): d3.Selection<SVGElement, any, any, any> {
		return this._svgSelection;
	}
	private _simulation: d3.Simulation<Node, Link>;
	get simulation(): d3.Simulation<Node, Link> {
		return this._simulation;
	}

	constructor(svgEl: SVGElement | d3.Selection<SVGElement, any, any, any>) {
		if (svgEl instanceof SVGElement) {
			this._svgElement = svgEl;
			this._svgSelection = d3.select(svgEl);
		} else {
			this._svgSelection = svgEl;
			this._svgElement = svgEl.node() as SVGElement;
		}

		this._simulation = this.createSimulation();
	}

	private createSimulation(): d3.Simulation<Node, Link> {
		const simulation = d3
			.forceSimulation<Node, Link>()
			.force("link", linkForce)
			.force("forceX", xForce)
			.force("forceY", yForce)
			.force("gravity", () => gravity(-10000))
			.force("collide", circleCollide)
			.on("tick", this.ticked.bind(this));

		return simulation;
	}

	private ticked(): void {}
}
