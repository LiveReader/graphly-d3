import * as d3 from "d3";
import ForceSimulation from "./forceSimulation";

import { Transform } from "./move";

export function createZoom(this: ForceSimulation): d3.ZoomBehavior<Element, any> {
	const zoom = d3
		.zoom()
		.extent([
			[0, 0],
			[this.svgElement.clientWidth, this.svgElement.clientHeight],
		])
		.scaleExtent([0.1, 3])
		.on("zoom", ({ transform }) => onZoom.bind(this)(transform));
	this.svgSelection
		.call(zoom as any)
		.call(
			(zoom as any).transform,
			d3.zoomIdentity.translate(this.worldTransform.x, this.worldTransform.y).scale(this.worldTransform.k)
		);
	this.svgSelection.on("dblclick.zoom", null);
	return zoom;
}

export function onZoom(this: ForceSimulation, transform: Transform) {
	this.selectionGroups.world.attr("transform", `translate(${transform.x}, ${transform.y}) scale(${transform.k})`);
	if (this.worldTransform.k != transform.k) {
		const movedRange = [this.worldTransform.k, transform.k].sort();
		Object.keys(this.onZoomRoutines).forEach((t) => {
			const threshold: number = parseFloat(t);
			if (threshold > movedRange[0] && threshold < movedRange[1]) {
				this.onZoomRoutines[threshold].forEach((routine) => routine(transform.k));
			}
		});
	}
	this.worldTransform = transform;

}
