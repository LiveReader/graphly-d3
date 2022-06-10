import * as d3 from "d3";
import { Template } from "../types/Template";
import { Node } from "../types/Node";

import { Shape, SVGShape, TextCollection, CollectionStyle, Alignment, ShapeStyle } from "../templateAPI";

const ErrorTemplate: Template = {
	shapeSize: 200,
	shapeBuilder: shapeBuilder,
};

function shapeBuilder(data: Node): d3.Selection<SVGElement, any, any, any> {
	const shape = Shape.create("g");

	const { icon_large } = addBody(shape);
	icon_large.classed("hidden", true);
	addTitle(shape);
	addDescription(data, shape);

	return shape;
}

export default ErrorTemplate;

function addBody(shape: d3.Selection<SVGElement, any, any, any>) {
	const body = SVGShape(`
		<g>
			<path id="border" d="M8.373,392.094c-11.164,-19.338 -11.164,-43.163 0,-62.5c39.417,-68.271 132.833,-230.073 172.249,-298.344c11.165,-19.338 31.798,-31.25 54.127,-31.25l344.498,0c22.329,-0 42.962,11.912 54.126,31.25c39.417,68.271 132.833,230.073 172.249,298.344c11.165,19.337 11.165,43.162 0,62.5c-39.416,68.271 -132.832,230.073 -172.249,298.344c-11.164,19.337 -31.797,31.25 -54.126,31.25l-344.498,-0c-22.329,-0 -42.962,-11.913 -54.127,-31.25c-39.416,-68.271 -132.832,-230.073 -172.249,-298.344Zm41.667,-0c-11.164,-19.338 -11.164,-43.163 0,-62.5c35.831,-62.06 115.585,-200.199 151.416,-262.26c11.164,-19.337 31.797,-31.25 54.126,-31.25l302.831,0c22.33,0 42.963,11.913 54.127,31.25c35.831,62.061 115.585,200.2 151.416,262.26c11.164,19.337 11.164,43.162 -0,62.5c-35.831,62.06 -115.585,200.199 -151.416,262.259c-11.164,19.338 -31.797,31.25 -54.127,31.25l-302.831,0c-22.329,0 -42.962,-11.912 -54.126,-31.25c-35.831,-62.06 -115.585,-200.199 -151.416,-262.259Z" style="fill:#e57373;" />
			<path id="body" d="M50.04,392.094c-11.164,-19.338 -11.164,-43.163 0,-62.5c35.831,-62.06 115.585,-200.199 151.416,-262.26c11.164,-19.337 31.797,-31.25 54.126,-31.25l302.831,0c22.33,0 42.963,11.913 54.127,31.25c35.831,62.061 115.585,200.2 151.416,262.26c11.164,19.337 11.164,43.162 -0,62.5c-35.831,62.06 -115.585,200.199 -151.416,262.259c-11.164,19.338 -31.797,31.25 -54.127,31.25l-302.831,0c-22.329,0 -42.962,-11.912 -54.126,-31.25c-35.831,-62.06 -115.585,-200.199 -151.416,-262.259Z" />
			<path id="icon" d="M392.598,301.417c-0,7.953 6.447,14.4 14.4,14.4c0.003,-0 0.005,-0 0.008,-0c3.817,-0 7.478,-1.516 10.177,-4.215c2.699,-2.699 4.215,-6.36 4.215,-10.177c-0,-1.135 -0,-2.281 -0,-3.416c-0,-3.817 -1.516,-7.478 -4.215,-10.177c-2.699,-2.699 -6.36,-4.215 -10.177,-4.215c-0.003,-0 -0.005,-0 -0.008,-0c-7.953,-0 -14.4,6.447 -14.4,14.4c-0,1.129 -0,2.27 -0,3.4Zm2.242,-47.423c0.2,6.587 5.597,11.823 12.187,11.823c0.003,-0 0.007,-0 0.01,-0c6.556,-0 11.93,-5.202 12.144,-11.755c0.506,-15.54 1.397,-42.915 1.944,-59.729c0.124,-3.806 -1.301,-7.499 -3.949,-10.235c-2.649,-2.736 -6.294,-4.281 -10.102,-4.281c-0.004,-0 -0.008,-0 -0.012,-0c-3.795,-0 -7.429,1.537 -10.072,4.261c-2.643,2.724 -4.07,6.403 -3.955,10.196c0.507,16.785 1.335,44.149 1.805,59.72Z" style="fill:#e57373;fill-rule:nonzero;" />
			<path id="icon_large" d="M371.559,477.859c-0,19.491 15.8,35.291 35.291,35.291c0.002,0 0.004,0 0.005,0c19.491,0 35.292,-15.8 35.292,-35.291c-0,-2.771 -0,-5.568 -0,-8.339c-0,-19.491 -15.801,-35.291 -35.292,-35.291c-0.001,-0 -0.003,-0 -0.005,-0c-19.491,-0 -35.291,15.8 -35.291,35.291c-0,2.771 -0,5.568 -0,8.339Zm5.494,-116.303c0.489,16.181 13.748,29.045 29.936,29.045l0.012,0c16.041,0 29.188,-12.726 29.71,-28.758c1.239,-38.08 3.425,-105.217 4.768,-146.446c0.303,-9.329 -3.19,-18.381 -9.681,-25.088c-6.492,-6.706 -15.426,-10.492 -24.759,-10.492c-0.003,-0 -0.005,-0 -0.007,-0c-9.309,-0 -18.22,3.77 -24.702,10.451c-6.481,6.68 -9.981,15.702 -9.699,25.006c1.243,41.116 3.268,108.114 4.422,146.282Z" style="fill:#e57373;fill-rule:nonzero;" />
		</g>
	`);

	shape.append(() => body.node());
	shape.classed("gly_animated", true)

	return {
		border: body.select("#border") as d3.Selection<SVGElement, any, any, any>,
		body: body.select("#body") as d3.Selection<SVGElement, any, any, any>,
		icon: body.select("#icon") as d3.Selection<SVGElement, any, any, any>,
		icon_large: body.select("#icon_large") as d3.Selection<SVGElement, any, any, any>,
	};
}

function addTitle(shape: d3.Selection<SVGElement, any, any, any>) {
	const bbox = Shape.getBBox(shape);
	const title = TextCollection("Template Error", CollectionStyle(100, bbox.width, 0, 140, 20, 20, 1), [
		ShapeStyle("class", "gly_text.dark"),
		ShapeStyle("font-weight", "bold"),
		ShapeStyle("font-size", "44pt"),
	]);
	shape.append(() => title.node());
	return title;
}

function addDescription(data: any, shape: d3.Selection<SVGElement, any, any, any>) {
	const bbox = Shape.getBBox(shape);
	const description = TextCollection(
		data?.errorMessage ?? "Something went wrong while rendering the template!",
		CollectionStyle(250, bbox.width, 0, bbox.height * 0.6, 15, 20, 4, Alignment.Center, [80, 130, 180, 230]),
		[ShapeStyle("class", "gly_text.dark"), ShapeStyle("font-size", "32pt")]
	);
	shape.append(() => description.node());
	return description;
}
