import Shape from "../Shape";

/**
 * @param  {String} text
 * @param  {ShapeStyle[]} styles
 * @return {Object} shape
 */
function TextShape(text: string, styles: any[] = []): d3.Selection<SVGElement, any, any, any> {
	const shape = Shape.create("g").classed("text", true);
	const textShape = shape.append("text").text(text);
	styles.forEach((s: any) => {
		if (s.key == "class") {
			s.value.split(".").forEach((c: any) => {
				textShape.classed(c, s.condition());
			});
		} else if (s.condition()) {
			textShape.style(s.key, s.value);
		}
	});
	return shape;
}

export default TextShape;
