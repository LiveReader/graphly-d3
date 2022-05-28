import ErrorNode from "../templates/ErrorNode";

let origin: string = "";
let templates: { [key: string]: any } = {};
let failed: string[] = [];
let errorTemplate: any = ErrorNode;

/**
 * @param  {string} id template id
 * @param  {function} shape template shape
 */
function add(id: string, shape: any) {
	templates[id] = shape;
}

/**
 * @param  {string} id template id
 */
async function get(id: string) {
	const template = await load(id).then(() => {
		if (!templates[id]) return errorTemplate;
		return templates[id];
	});
	return template;
}

/**
 * @param  {string} id template id
 */
async function load(id: string) {
	if (templates[id]) return;
	if (failed.includes(id)) return;
	const url = origin + id + ".js";
	await import(url)
		.then(({ default: template }) => {
			add(id, template);
		})
		.catch((error) => {
			console.error(`Template "${id}" not founnd`);
			console.error(error);
			failed.push(id);
		})
		.finally(() => {});
}

export default {
	origin,
	templates,
	failed,
	errorTemplate,
	add,
	get,
};
