/**
 * @param  {Number[]} padding padding of tag [x,y]
 * @param  {String[]} textStyles array of css classes
 * @param  {String[]} backgroundStyles array of css classes
 * @param  {Number} cornerRadius radius of the corners
 * @return {Object} style
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
 */
function TagShape(text, style) {
	const shape = Shape.create("g").classed("tag", true);

	const textShape = shape.append("text").text(text).attr("dy", "0.5em");
	style.textStyles.forEach((style) => {
		textShape.classed(style, true);
	});
	const textBBox = Shape.getBBox(textShape);

	const backgroundShape = shape
		.append("path")
		.attr(
			"d",
			`M ${textBBox.width / 2 - style.padding[0]} ${-style.padding[1]} ` +
				`L ${textBBox.width + style.padding[0] - style.cornerRadius} ${-style.padding[1]} ` +
				`A ${style.cornerRadius} ${style.cornerRadius} 0 0 1 ${textBBox.width + style.padding[0]} ${
					-style.padding[1] + style.cornerRadius
				} ` +
				`L ${textBBox.width + style.padding[0]} ${textBBox.height + style.padding[1] - style.cornerRadius} ` +
				`A ${style.cornerRadius} ${style.cornerRadius} 0 0 1 ${
					textBBox.width + style.padding[0] - style.cornerRadius
				} ${textBBox.height + style.padding[1]} ` +
				`L ${-style.padding[0] + style.cornerRadius} ${textBBox.height + style.padding[1]} ` +
				`A ${style.cornerRadius} ${style.cornerRadius} 0 0 1 ${-style.padding[0]} ${
					textBBox.height + style.padding[1] - style.cornerRadius
				} ` +
				`L ${-style.padding[0]} ${-style.padding[1] + style.cornerRadius} ` +
				`A ${style.cornerRadius} ${style.cornerRadius} 0 0 1 ${-style.padding[0] + style.cornerRadius} ${-style
					.padding[1]} ` +
				`Z`
		);
	style.backgroundStyles.forEach((style) => {
		backgroundShape.classed(style, true);
	});

	return shape;
}
