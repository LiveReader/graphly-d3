import { LODStyle, applyLODStyles } from "./styleModifier";

export function OnZoom(data: any, threshold: number | number[], styles: LODStyle[] = []) {
	if (Array.isArray(threshold)) {
		threshold.forEach((t) => register(data, t, styles));
	} else {
		register(data, threshold, styles);
	}
}

function register(data: any, threshold: number, styles: LODStyle[] = []) {
	const id = `${data.id}-${threshold}`;
	const globalThreshold = threshold / (isNaN(data.shape.scale) ? 1 : data.shape.scale);
	data.forceSimulation.registerOnZoom(id, globalThreshold, (k: number) => {
		const relativeScale = k * (isNaN(data.shape.scale) ? 1 : data.shape.scale);
		applyLODStyles(relativeScale, styles);
	});
}
