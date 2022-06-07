import { Node } from "../types/Node";
import { Link } from "../types/Link";

export enum Event {
	NodeClick = "node:click",
	NodeDoubleClick = "node:doubleclick",
	NodeContextMenu = "node:contextmenu",

	LinkClick = "link:click",
	LinkDoubleClick = "link:doubleclick",
	LinkContextMenu = "link:contextmenu",

	SimulationTick = "simulation:tick",
	SimulationTickEnd = "simulation:tickend",
}

const Events: { [key in Event]: { [key: string]: (...args: any[]) => void } } = {
	[Event.NodeClick]: {
		event: (d: any) => d,
		node: (d: Node) => d,
	},
	[Event.NodeDoubleClick]: {
		event: (d: any) => d,
		node: (d: Node) => d,
	},
	[Event.NodeContextMenu]: {
		event: (d: any) => d,
		node: (d: Node) => d,
	},

	[Event.LinkClick]: {
		event: (d: any) => d,
		link: (d: Link) => d,
	},
	[Event.LinkDoubleClick]: {
		event: (d: any) => d,
		link: (d: Link) => d,
	},
	[Event.LinkContextMenu]: {
		event: (d: any) => d,
		link: (d: Link) => d,
	},

	[Event.SimulationTick]: {},
	[Event.SimulationTickEnd]: {},
};

export class EventStore {
	public static readonly events: { [key: string]: { [key: string]: (...args: any[]) => void } } = Events;

	private register: { [key: string]: { [key: string]: (...args: any[]) => void } } = {};

	public on(event: Event, callback: (...args: any[]) => void) {
		if (!this.register[event]) this.register[event] = {};
		this.register[event][callback.name] = callback;
	}

	public off(event: Event, callback: (...args: any[]) => void) {
		if (!this.register[event]) return;
		delete this.register[event][callback.name];
	}

	public emit(event: Event, ...args: any[]) {
		if (!this.register[event]) return;
		for (const callback in this.register[event]) {
			this.register[event][callback](...args);
		}
	}
}
