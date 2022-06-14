import * as d3 from "d3";
import { LODStyle, applyLODStyles } from "./styleModifier";

export function OnZoom(data: any, threshold: number, styles: LODStyle[] = []) {
	const id = `${data.id}-${threshold}`;
	const globalThreshold = threshold / (isNaN(data.shape.scale) ? 1 : data.shape.scale);
	data.forceSimulation.registerOnZoom(id, globalThreshold, (k: number) => {
		if (d3.select("[data-id='" + data.id + "']").size() === 0) return data.forceSimulation.deregisterOnZoom(id);
		const relativeScale = k * (isNaN(data.shape.scale) ? 1 : data.shape.scale);
		applyLODStyles(relativeScale, styles);
	});
}
