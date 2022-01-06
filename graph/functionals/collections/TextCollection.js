/**
 * @param  {String[]} texts array of strings
 * @param  {CollectionStyle} style collection style
 * @param  {ShapeStyle[]} textStyles array of text styles
 * @return {Object} shape
 */
function TextCollection(texts, style, textStyles = []) {
	const textShapes = [];
	texts.forEach((text) => {
		const textShape = TextShape(text, textStyles);
		textShapes.push(textShape);
	});
	const ellipsis = TextShape("...", textStyles);
	const collection = ShapeCollection(textShapes, style, ellipsis);
	return collection;
}
