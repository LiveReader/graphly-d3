const TemplateAPI = {};

TemplateAPI.templates = {};

TemplateAPI.errorTemplate = {};

/**
 * @param  {string} id template id
 * @param  {function} shape template shape
 */
TemplateAPI.add = function (id, shape) {
	TemplateAPI.templates[id] = shape;
	return this;
};

TemplateAPI.get = function (id) {
	if (!TemplateAPI.templates[id]) {
		return TemplateAPI.errorTemplate;
	}
	return TemplateAPI.templates[id];
};
