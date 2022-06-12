import { Template } from "../types/Template";
import { Node } from "../types/Node";
import ErrorTemplate from "../templates/ErrorTemplate";

export default class TemplateStore {
	private _errorTemplate: Template = ErrorTemplate;
	get errorTemplate(): Template {
		return this._errorTemplate;
	}
	private _templates: { [key: string]: Template } = {};
	get templates(): { [key: string]: Template } {
		return this._templates;
	}
	private failed: string[] = [];

	public remoteOrigin: string = "";

	public add(id: string, template: Template) {
		this._templates[id] = template;
	}

	public async get(node: Node): Promise<Template | undefined> {
		const id = node.shape.type;
		if (this.templates[id]) return this.templates[id];
		if (this.failed.includes(id)) return this.errorTemplate;
		const template = await this.load(node.shape.url ?? this.remoteOrigin + id + ".js", id).then(() => {
			if (this.templates[id]) return this.templates[id];
			return undefined;
		});
		return template;
	}

	private async load(url: string, id: string) {
		if (this.failed.includes(id)) return;
		if (origin == "") return;
		await import(/* webpackIgnore: true */ /* @vite-ignore */ url)
			.then(({ default: template }) => {
				this.add(id, template);
			})
			.catch((error) => {
				console.error(`Template "${id}" not founnd – Fetched from "${url}"`);
				console.error(error);
				this.failed.push(id);
			})
			.finally(() => {});
	}
}
