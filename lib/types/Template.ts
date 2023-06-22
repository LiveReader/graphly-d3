import * as d3 from "d3";
import { Node } from "./Node";
import type * as TAPI from "../templateAPI";

export interface Template<T = any> {
	shapeSize: number;
	shapePayload?: T;
	shapeBuilder: (data: Node<T>, TemplateAPI: typeof TAPI) => d3.Selection<any, any, any, any>;
}
