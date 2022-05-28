import ErrorNode from "../templates/ErrorNode";

let TemplateAPI: {
	origin: string;
	templates: { [key: string]: any };
	failed: string[];
	errorTemplate: any;
	add: (id: string, shape: any) => void;
	get: (id: string) => Promise<any>;
	load: (id: string) => Promise<any>;
} = {
	origin: "",
	templates: {},
	failed: [],
	errorTemplate: ErrorNode,
	add,
	get,
	load,
};

/**
 * @param  {string} id template id
 * @param  {function} shape template shape
 */
function add(id: string, shape: any) {
	TemplateAPI.templates[id] = shape;
}

/**
 * @param  {string} id template id
 */
async function get(id: string) {
	const template = await load(id).then(() => {
		if (!TemplateAPI.templates[id]) return TemplateAPI.errorTemplate;
		return TemplateAPI.templates[id];
	});
	return template;
}

/**
 * @param  {string} id template id
 */
async function load(id: string) {
	if (TemplateAPI.templates[id]) return;
	if (TemplateAPI.failed.includes(id)) return;
	const url = TemplateAPI.origin + id + ".js";

	await import(url)
		.then(({ default: template }) => {
			add(id, template);
		})
		.catch((error) => {
			console.error(`Template "${id}" not founnd`);
			console.error(error);
			TemplateAPI.failed.push(id);
		})
		.finally(() => {});
}

export default TemplateAPI;
