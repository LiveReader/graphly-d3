/**
 * @param  {Object} parent D3 parent object
 * @param  {string} text the text within the tag
 * @param  {ShapeStyle[]} styles the styles for the tag
 * @param  {ShapeStyle[]} textStyles the styles for the text
 * @param  {ShapeStyle[]} backgroundStyles the styles for the background
 * @return {Object} shape
 */
function Tag(parent, text, padding, styles = [], textStyles = [], backgroundStyles = []) {
	const shape = parent.append("g")
	styles.forEach((style) => {
		shape.classed(style.className, (d) => style.condition(d));
	});

	const textShape = shape.append("text").text(text).attr("dy", "0.65em");
	textStyles.forEach((style) => {
		textShape.classed(style.className, (d) => style.condition(d));
	});

	const backgroundShape = shape
		.append("rect")
		.attr("height", (d) => textShape.node().getBBox().height + padding * 2 || 0)
		.attr("width", (d) => textShape.node().getBBox().width + padding * 2 || 0)
		.attr("x", (d) => -textShape.node().getBBox().width / 2 - padding || 0)
		.attr("y", (d) => -textShape.node().getBBox().height / 2 - padding || 0);
	backgroundStyles.forEach((style) => {
		backgroundShape.classed(style.className, (d) => style.condition(d));
	});

	shape.remove();
	return shape.node();
}
