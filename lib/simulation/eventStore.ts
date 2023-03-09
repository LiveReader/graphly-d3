import { Node } from "../types/Node";
import { Link } from "../types/Link";

import { Transform } from "./move";

export enum Event {
	NodeClick = "node:click",
	NodeDoubleClick = "node:doubleclick",
	NodeContextMenu = "node:contextmenu",
	NodeDragStart = "node:dragstart",
	NodeDragMove = "node:dragmove",
	NodeDragEnd = "node:dragend",

	LinkClick = "link:click",
	LinkDoubleClick = "link:doubleclick",
	LinkContextMenu = "link:contextmenu",
	LinkDragStart = "link:dragstart",
	LinkDragMove = "link:dragmove",
	LinkDragEnd = "link:dragend",

	EnvironmentClick = "environment:click",
	EnvironmentDoubleClick = "environment:doubleclick",
	EnvironmentContextMenu = "environment:contextmenu",
	EnvironmentMove = "environment:move",
	ThemeChange = "theme:change",

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
	[Event.NodeDragStart]: {
		event: (d: any) => d,
		node: (d: Node) => d,
		pos: (x: number, y: number) => ({ x, y }),
	},
	[Event.NodeDragMove]: {
		event: (d: any) => d,
		node: (d: Node) => d,
		pos: (x: number, y: number) => ({ x, y }),
	},
	[Event.NodeDragEnd]: {
		event: (d: any) => d,
		node: (d: Node) => d,
		pos: (x: number, y: number) => ({ x, y }),
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
	[Event.LinkDragStart]: {
		event: (d: any) => d,
		source: (d: Node) => d,
		pos: (x: number, y: number) => ({ x, y }),
	},
	[Event.LinkDragMove]: {
		event: (d: any) => d,
		source: (d: Node) => d,
		pos: (x: number, y: number) => ({ x, y }),
	},
	[Event.LinkDragEnd]: {
		event: (d: any) => d,
		source: (d: Node) => d,
		target: (d: Node | null) => d,
		pos: (x: number, y: number) => ({ x, y }),
	},

	[Event.EnvironmentClick]: {
		event: (d: any) => d,
		pos: (x: number, y: number) => ({ x, y }),
	},
	[Event.EnvironmentDoubleClick]: {
		event: (d: any) => d,
		pos: (x: number, y: number) => ({ x, y }),
	},
	[Event.EnvironmentContextMenu]: {
		event: (d: any) => d,
		pos: (x: number, y: number) => ({ x, y }),
	},
	[Event.EnvironmentMove]: {
		pos: (t: Transform) => t,
	},
	[Event.ThemeChange]: {
		theme: (t: "light" | "dark") => t,
	},

	[Event.SimulationTick]: {},
	[Event.SimulationTickEnd]: {},
};

export class EventStore {
	public static readonly events: { [key: string]: { [key: string]: (...args: any[]) => void } } = Events;

	private register: { [key: string]: { [key: string]: (...args: any[]) => void }[] } = {};

	public on(event: string, callback: (...args: any[]) => void) {
		if (!this.register[event]) this.register[event] = [];
		this.register[event].push({ [callback.name]: callback });
	}

	public off(event: string, callback: (...args: any[]) => void) {
		if (!this.register[event]) return;
		this.register[event] = this.register[event].filter((c) => c[callback.name] !== callback);
	}

	public emit(event: string, ...args: any[]): any {
		if (!this.register[event]) return;
		this.register[event].forEach((callback) => {
			for (const c in callback) {
				callback[c](...args);
			}
		});
	}
}
