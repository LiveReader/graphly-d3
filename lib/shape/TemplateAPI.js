import ErrorNode from "../templates/ErrorNode.js";

const TemplateAPI = {};

TemplateAPI.origin = "";
TemplateAPI.templates = {};
TemplateAPI.failed = [];
TemplateAPI.errorTemplate = ErrorNode;

/**
 * @param  {string} id template id
 * @param  {function} shape template shape
 */
TemplateAPI.add = function (id, shape) {
	TemplateAPI.templates[id] = shape;
	return this;
};

/**
 * @param  {string} id template id
 */
TemplateAPI.get = async function (id) {
	const template = await TemplateAPI.load(id).then(() => {
		if (!TemplateAPI.templates[id]) return TemplateAPI.errorTemplate;
		return TemplateAPI.templates[id];
	});
	return template;
};

/**
 * @param  {string} id template id
 */
TemplateAPI.load = async function (id) {
	if (TemplateAPI.templates[id]) return;
	if (TemplateAPI.failed.includes(id)) return;
	const url = TemplateAPI.origin + id + ".js";
	await import(url)
		.then(({ default: template }) => {
			TemplateAPI.add(id, template);
		})
		.catch(() => {
			console.error(`Template "${id}" not founnd`);
			TemplateAPI.failed.push(id);
		})
		.finally(() => {});
};

export default TemplateAPI;
