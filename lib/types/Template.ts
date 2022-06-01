import * as d3 from "d3";
import { Node } from "./Node";

export interface Template {
	shapeSize: number;
	shapeBuilder: (
		data: Node,
		initialShape: d3.Selection<SVGElement, any, any, any> | null,
		changes: Node | null,
		TemplateAPI: any
	) => d3.Selection<SVGElement, any, any, any>;
}
