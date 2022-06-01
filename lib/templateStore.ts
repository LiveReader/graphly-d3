import { Template } from "./types/Template";
import ErrorTemplate from "./templates/ErrorTemplate";

const TemplateStore: {
	remoteOrigin: string;
	errorTemplate: Template;
	templates: { [id: string]: Template };
	failed: string[];
	add: (id: string, template: Template) => void;
	get: (id: string) => Promise<Template>;
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

async function get(id: string): Promise<Template> {
	if (TemplateStore.templates[id]) return TemplateStore.templates[id];
	if (TemplateStore.failed.includes(id)) return TemplateStore.errorTemplate;
	const template = await load(TemplateStore.remoteOrigin, id).then(() => {
		if (TemplateStore.templates[id]) return TemplateStore.templates[id];
		return TemplateStore.errorTemplate;
	});
	return template;
}

async function load(origin: string, id: string) {
	if (TemplateStore.failed.includes(id)) return;
	if (origin == "") return;
	const url = origin + id + ".js";
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
