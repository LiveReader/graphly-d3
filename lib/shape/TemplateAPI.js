import ErrorNode from "../templates/ErrorNode.js";
import PersonHexagon from "../templates/PersonHexagon.js";
import VehicleHexagon from "../templates/VehicleHexagon.js";
import EmergencyHexagon from "../templates/EmergencyHexagon.js";

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
TemplateAPI.add("shape_03", EmergencyHexagon);

export default TemplateAPI;
