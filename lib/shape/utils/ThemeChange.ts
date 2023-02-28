import { Node } from "../../types/Node";

export function OnThemeChange(data: Node, callback: (theme: "light" | "dark") => void) {
	if (!data.forceSimulation) return;
	callback(data.forceSimulation.theme);
	data.forceSimulation.eventStore.on("theme:change", callback);
}
