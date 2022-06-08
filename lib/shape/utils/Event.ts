import { Node } from "../../types/Node";

export function FireEvent(identifier: string, data: Node, event: any, ...args: any[]) {
	data.forceSimulation.eventStore.emit(`template:${data.shape.type}:${identifier}`, data, event, ...args);
}
