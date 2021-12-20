/**
 * @param  {Object} parent D3 parent object
 * @param  {string} text the text within the tag
 * @param  {ShapeStyle[]} styles the styles for the tag
 * @return {Object} shape
 */
function Text(parent, text, styles = []) {
	const shape = parent.append("text");
	styles.forEach((style) => {
		shape.classed(style.className, (d) => style.condition(d));
	});
	shape.text(text);
	shape.remove();
	return shape.node();
}
