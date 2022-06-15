import { Node } from "../types/Node";
import { Template } from "../types/Template";

interface StoreNode {
	shape: {
		type: string;
		template?: Template;
	};
	payload?: any;
}

export default class NodeDataStore {
	private nodes: { [id: string]: StoreNode } = {};

	public clear() {
		this.nodes = {};
	}

	public add(id: string, node: Node) {
		this.nodes[id] = this.storeNode(node);
	}

	public remove(id: string) {
		delete this.nodes[id];
	}

	public hasNode(id: string): boolean {
		return this.nodes[id] !== undefined;
	}

	public hasTemplateChange(id: string, data: Node): boolean {
		const node = this.nodes[id];
		if (node === undefined) return false;
		return node.shape.type !== data.shape.type || node.shape.template !== data.shape.template;
	}

	public hasPayloadChanges(id: string, data: Node): boolean {
		const node = this.nodes[id];
		if (!node) return true;
		return JSON.stringify(node.payload ?? "") !== JSON.stringify(data.payload ?? "");
	}

	private storeNode(node: Node): StoreNode {
		const copy: StoreNode = {
			shape: {
				type: Object.assign({}, node.shape).type,
				template: Object.assign({}, node.shape).template,
			},
			payload: node.payload ? this.deepCopy<any>(node.payload) : undefined,
		};
		return copy;
	}

	private deepCopy<T>(instance: T): T {
		if (instance == null) {
			return instance;
		}
		if (instance instanceof Array) {
			var cloneArray = [] as any[];
			(instance as any[]).forEach((value) => {
				cloneArray.push(value);
			});
			return cloneArray.map((value: any) => this.deepCopy<any>(value)) as any;
		}
		if (instance instanceof Object) {
			var copyInstance = { ...(instance as { [key: string]: any }) } as { [key: string]: any };
			for (var attr in instance) {
				if ((instance as Object).hasOwnProperty(attr)) copyInstance[attr] = this.deepCopy<any>(instance[attr]);
			}
			return copyInstance as T;
		}
		return instance;
	}
}
