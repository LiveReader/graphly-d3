import { Node } from "../../types/Node";

export function EmitEvent(identifier: string, data: Node, event: any, ...args: any[]) {
	if (!data.forceSimulation) return;
	data.forceSimulation.eventStore.emit(`template:${data.shape.type}:${identifier}`, data, event, ...args);
}
