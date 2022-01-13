import ErrorNode from "../templates/ErrorNode";
import PersonHexagon from "../templates/PersonHexagon";
import VehicleHexagon from "../templates/VehicleHexagon";

const TemplateAPI = {};

TemplateAPI.templates = {};

TemplateAPI.errorTemplate = ErrorNode;

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

TemplateAPI.add("shape_01", PersonHexagon);
TemplateAPI.add("shape_02", VehicleHexagon);

export default TemplateAPI;
