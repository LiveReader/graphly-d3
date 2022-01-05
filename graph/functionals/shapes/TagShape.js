/**
 * @param  {String} text text of tag
 * @param  {Number[]} padding padding of tag [x,y]
 * @param  {String[]} textStyles array of css classes
 * @param  {String[]} backgroundStyles array of css classes
 */
function TagShape(text, padding = [0, 0], textStyles = [], backgroundStyles = [], cornerRadius = 10) {
	const shape = Shape.create("g").classed("tag", true);

	const textShape = shape.append("text").text(text).attr("dy", "0.5em");
	textStyles.forEach((style) => {
		textShape.classed(style, true);
	});
	const textBBox = Shape.getBBox(textShape);

	const backgroundShape = shape
		.append("path")
		.attr(
			"d",
			`M ${textBBox.width / 2 - padding[0]} ${-padding[1]} ` +
				`L ${textBBox.width + padding[0] - cornerRadius} ${-padding[1]} ` +
				`A ${cornerRadius} ${cornerRadius} 0 0 1 ${textBBox.width + padding[0]} ${
					-padding[1] + cornerRadius
				} ` +
				`L ${textBBox.width + padding[0]} ${textBBox.height + padding[1] - cornerRadius} ` +
				`A ${cornerRadius} ${cornerRadius} 0 0 1 ${textBBox.width + padding[0] - cornerRadius} ${
					textBBox.height + padding[1]
				} ` +
				`L ${-padding[0] + cornerRadius} ${textBBox.height + padding[1]} ` +
				`A ${cornerRadius} ${cornerRadius} 0 0 1 ${-padding[0]} ${
					textBBox.height + padding[1] - cornerRadius
				} ` +
				`L ${-padding[0]} ${-padding[1] + cornerRadius} ` +
				`A ${cornerRadius} ${cornerRadius} 0 0 1 ${-padding[0] + cornerRadius} ${-padding[1]} ` +
				`Z`
		);
	backgroundStyles.forEach((style) => {
		backgroundShape.classed(style, true);
	});

	return shape;
}
