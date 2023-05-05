import { Node } from "../../types/Node";

export function EmitEvent(identifier: string, data: Node, event: any, ...args: any[]) {
	if (!data.simulation) return;
	data.simulation.eventStore.emit(`template:${data.shape.type}:${identifier}`, data, event, ...args);
}
