import * as Shape from "../shape";

function PathShape(path: string): d3.Selection<SVGElement, any, any, any> {
	const shape = Shape.create("path");
	shape.attr("d", path);
	return shape;
}

export default PathShape;
