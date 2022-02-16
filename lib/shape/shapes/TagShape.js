import Shape from "../Shape.js";

/**
 * @param  {Number[]} padding padding of tag [x,y]
 * @param  {ShapeStyle[]} textStyles array of css classes
 * @param  {ShapeStyle[]} backgroundStyles array of css classes
 * @param  {Number} cornerRadius radius of the corners
 */
function TagStyle(padding = [0, 0], textStyles = [], backgroundStyles = [], cornerRadius = 0) {
	return {
		padding: typeof padding === "number" ? [padding, padding] : padding,
		textStyles: textStyles,
		backgroundStyles: backgroundStyles,
		cornerRadius: cornerRadius,
	};
}

/**
 * @param  {String} text text of tag
 * @param  {TagStyle} style of the tag
 * @return {Object} shape
 */
function TagShape(text, style) {
	const shape = Shape.create("g").classed("tag", true);

	const textShape = shape.append("text").text(text).attr("dy", "0.35em");
	style.textStyles.forEach((s) => {
		if (s.key == "class") {
			textShape.classed(s.value, s.condition());
		} else if (s.condition()) {
			textShape.style(s.key, s.value);
		}
	});
	const textBBox = Shape.getBBox(shape);

	const width = textBBox.width + style.padding[0] * 2;
	const height = textBBox.height + style.padding[1] * 2;
	const cr = style.cornerRadius;
	const backgroundShape = shape
		.append("path")
		.attr(
			"d",
			`M ${0} ${-height / 2} ` +
				`L ${width / 2 - cr} ${-height / 2} ` +
				`A ${cr} ${cr} 0 0 1 ${width / 2} ${-(height / 2) + cr} ` +
				`L ${width / 2} ${height / 2 - cr} ` +
				`A ${cr} ${cr} 0 0 1 ${width / 2 - cr} ${height / 2} ` +
				`L ${-width / 2 + cr} ${height / 2} ` +
				`A ${cr} ${cr} 0 0 1 ${-width / 2} ${height / 2 - cr} ` +
				`L ${-width / 2} ${-height / 2 + cr} ` +
				`A ${cr} ${cr} 0 0 1 ${-width / 2 + cr} ${-height / 2} ` +
				`Z`
		);
	style.backgroundStyles.forEach((s) => {
		if (s.key == "class") {
			backgroundShape.classed(s.value, s.condition());
		} else if (s.condition()) {
			backgroundShape.style(s.key, s.value);
		}
	});

	textShape.remove();
	shape.append(() => textShape.node());
	return shape;
}

export { TagStyle, TagShape };
