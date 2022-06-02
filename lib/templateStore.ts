import { Template } from "./types/Template";
import { Node } from "./types/Node";
import ErrorTemplate from "./templates/ErrorTemplate";

const TemplateStore: {
	remoteOrigin: string;
	errorTemplate: Template;
	templates: { [id: string]: Template };
	failed: string[];
	add: (id: string, template: Template) => void;
	get: (node: Node) => Promise<Template>;
} = {
	remoteOrigin: "",
	errorTemplate: ErrorTemplate,
	templates: {},
	failed: [],
	add,
	get,
};

function add(id: string, template: Template) {
	TemplateStore.templates[id] = template;
}

async function get(node: Node): Promise<Template> {
	const id = node.shape.type;
	if (TemplateStore.templates[id]) return TemplateStore.templates[id];
	if (TemplateStore.failed.includes(id)) return TemplateStore.errorTemplate;
	const template = await load(node.shape.url ?? TemplateStore.remoteOrigin + id + ".js", id).then(() => {
		if (TemplateStore.templates[id]) return TemplateStore.templates[id];
		return TemplateStore.errorTemplate;
	});
	return template;
}

async function load(url: string, id: string) {
	if (TemplateStore.failed.includes(id)) return;
	if (origin == "") return;
	await import(/* webpackIgnore: true */ /* @vite-ignore */ url)
		.then(({ default: template }) => {
			add(id, template);
		})
		.catch((error) => {
			console.error(`Template "${id}" not founnd – Fetched from "${url}"`);
			console.error(error);
			TemplateStore.failed.push(id);
		})
		.finally(() => {});
}

export default TemplateStore;
