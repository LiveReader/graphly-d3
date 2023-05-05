import { Node } from "../../types/Node";

export function OnThemeChange(data: Node, callback: (theme: "light" | "dark") => void) {
	callback(data.renderConfig?.theme ?? "light");
	if (!data.simulation) return;
	data.simulation.eventStore.on("theme:change", callback);
}

export function brightness(color: string) {
	if (!color) return -1;
	const isHEX = color.indexOf("#") == 0;
	const isRGB = color.indexOf("rgb") == 0;
	if (isHEX) {
		const hasFullHex = color.length == 7;
		const r = hasFullHex ? parseInt(color.substring(1, 3), 16) : parseInt(color.substring(1, 2), 16);
		const g = hasFullHex ? parseInt(color.substring(3, 5), 16) : parseInt(color.substring(2, 3), 16);
		const b = hasFullHex ? parseInt(color.substring(5, 7), 16) : parseInt(color.substring(3, 4), 16);
		return (r * 299 + g * 587 + b * 114) / 1000 / 255;
	} else if (isRGB) {
		const rgb = color.match(/\d+/g);
		if (!rgb || rgb.length < 3) return -1;
		const r = parseInt(rgb[0]);
		const g = parseInt(rgb[1]);
		const b = parseInt(rgb[2]);
		return (r * 299 + g * 587 + b * 114) / 1000 / 255;
	}
	return -1;
}
export function isLight(color: string) {
	return brightness(color) > 0.5;
}
export function isDark(color: string) {
	return brightness(color) < 0.5 && brightness(color) >= 0;
}
