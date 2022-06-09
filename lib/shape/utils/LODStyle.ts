import { LODStyle, applyLODStyles } from "./styleModifier";

export function OnZoom(data: any, threshold: number, styles: LODStyle[] = []) {
	const id = `${data.id}-${threshold}`; // Math.random().toString(36).substring(7);
	const globalThreshold = threshold / (isNaN(data.shape.scale) ? 1 : data.shape.scale);
	data.forceSimulation.registerOnZoom(id, globalThreshold, (k: number) => {
		if (!document.getElementById(data.id)) {
			data.forceSimulation.deregisterOnZoom(id);
			return;
		}
		const relativeScale = k * (isNaN(data.shape.scale) ? 1 : data.shape.scale);
		applyLODStyles(relativeScale, styles);
	});
}
