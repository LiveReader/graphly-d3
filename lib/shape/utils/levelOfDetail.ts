import { Node } from "../../main";
import { LODStyle, applyLODStyles } from "./styleModifier";

export function OnZoom(data: Node, threshold: number | number[], styles: LODStyle[] = []) {
	if (Array.isArray(threshold)) {
		threshold.forEach((t) => register(data, t, styles));
	} else {
		register(data, threshold, styles);
	}
}

function register(data: Node, threshold: number, styles: LODStyle[] = []) {
	const id = `${data.id}-${threshold}`;
	const globalThreshold = threshold / (isNaN(data.shape.scale) ? 1 : data.shape.scale);
	const callback = (k: number) => {
		const relativeScale = k * (isNaN(data.shape.scale) ? 1 : data.shape.scale);
		applyLODStyles(relativeScale, styles);
		return true;
	};
	if (data.renderConfig) callback(data.renderConfig.scale);
	if (data.forceSimulation && data.forceSimulation.registerOnZoom)
		data.forceSimulation.registerOnZoom(id, globalThreshold, callback);
}
