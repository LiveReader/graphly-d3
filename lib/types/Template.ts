import * as d3 from "d3";
import { Node } from "./Node";

export interface Template {
	shapeSize: number;
	shape: (
		data: Node,
		initialShape: d3.Selection<SVGElement, any, any, any> | null,
		changes: Node,
		TemplateAPI: any
	) => d3.Selection<SVGElement, any, any, any>;
}
