import * as d3 from "d3";
import { Node } from "./Node";

export interface Template<T = any> {
	shapeSize: number;
	shapePayload?: T;
	shapeBuilder: (data: Node<T>, TemplateAPI: any) => d3.Selection<any, any, any, any>;
}
