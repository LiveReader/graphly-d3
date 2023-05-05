import type { Node, RenderConfig } from "../types/Node";
import * as Shape from "./Shape";
import * as TemplateAPI from "../templateAPI";
import { Template } from "../main";

import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true });

export function renderTemplate(template: Template, data: Node, config: RenderConfig): Promise<SVGElement> {
	data.renderConfig = config;
	const nodeShape = Shape.create("g");
	nodeShape.classed("gly-node", true).attr("data-id", data.id);
	if (!template) return throwError(`[graphly-d3] Template "${data.shape.type}" not found!`);

	if (!template.shapePayload) {
		console.warn(
			`[graphly-d3] "${data.shape.type}" has no payload schema defined! \n\nIf you are the author of this template, you can find more details here: https://docs.graphly.dev/template-api/shape_payload`
		);
	} else {
		const validate = ajv.compile(template.shapePayload);
		const isValid = validate(data.payload);
		if (!isValid) {
			console.error(
				`[graphly-d3] Invalid payload for "${data.shape.type}"\n • ${validate.errors
					?.map((e) => `${e.instancePath} ${e.message}`)
					.join("\n • ")} \n\nTroubleshooting: https://docs.graphly.dev/troubleshooting/`
			);
			return throwError(
				`"${data.shape.type}" ${validate.errors?.[0].instancePath} ${validate.errors?.[0].message}`,
				false
			);
		}
	}

	try {
		nodeShape.append(() => template.shapeBuilder(data, TemplateAPI).node()).attr("data-object", "shape");
	} catch (e: any) {
		console.error(
			`[graphly-d3] Template "${data.shape.type}" failed rendering with error: \n${e} \n\nTroubleshooting: https://docs.graphly.dev/troubleshooting/`
		);
		return throwError(e.message);
	}

	const shapeSize = (template.shapeSize ?? 300) * data.shape.scale * config.scale;
	Shape.transform(nodeShape.select("[data-object=shape]"), shapeSize);
	const selection = nodeShape.node();
	if (selection === null) return throwError(`[graphly-d3] Template "${data.shape.type}" failed rendering!`);
	return Promise.resolve(selection);
}

function throwError(message: string, log: boolean = true): Promise<never> {
	if (log) console.error(message);
	return Promise.reject(message);
}
