/**
 * @param  {number[]} padding x and y padding [x, y]
 * @param  {ShapeStyle[]} textStyles the styles for the text
 * @param  {ShapeStyle[]} backgroundStyles the styles for the background
 * @return {Object} style
 */
function TagStyle(padding, textStyles = [], backgroundStyles = []) {
	return {
		padding: padding,
		textStyles: textStyles,
		backgroundStyles: backgroundStyles,
	};
}

/**
 * @param  {Object} parent D3 parent object
 * @param  {string} text the text within the tag
 * @param  {TagStyle} style the styles for the tag
 * @return {Object} shape
 */
function Tag(parent, text, style) {
	const shape = parent.append("g");

	const textShape = shape.append("text");
	style.textStyles.forEach((style) => {
		textShape.classed(style.className, (d) => style.condition(d));
	});
	textShape.text(text).attr("dy", "0.5em");

	const backgroundShape = shape
		.append("rect")
		.attr("height", (d) => textShape.node().getBBox().height + style.padding[1] * 2 || 0)
		.attr("width", (d) => textShape.node().getBBox().width + style.padding[0] * 2 || 0)
		.attr("y", (d) => -textShape.node().getBBox().height / 2 - style.padding[1] / 2 || 0)
		.attr("x", (d) => -textShape.node().getBBox().width / 2 - style.padding[0] || 0);
	style.backgroundStyles.forEach((style) => {
		backgroundShape.classed(style.className, (d) => style.condition(d));
	});

	textShape.node().parentNode.appendChild(textShape.node());
	shape.remove();
	return shape.node();
}

class TagCollectionFactory extends CollectionFactory {
	/**
	 * @callback onElement
	 * @param    {object} data D3 data object
	 * @return   {string} tag texts as array to be rendered
	 */
	/**
	 * @param  {Object} shape d3 data object
	 * @param  {CollectionStyle} collectionStyle the collection style
	 * @param  {TagStyle} tagStyle the styles for each tag
	 * @callback onElement onElement function to be called on each element created on data
	 */
	constructor(
		simulation,
		shape,
		collectionStyle,
		tagStyle,
		onElement = (el) => {
			return [];
		}
	) {
		super(simulation, collectionStyle);

		shape.select((d) => {
			const currentNode = shape.filter((el) => el.id === d.id);
			currentNode.select((el) => {
				const tags = onElement(el);
				tags.forEach((tag) => {
					const tagElement = Tag(currentNode, tag, tagStyle);
					super.addItem(tagElement, currentNode);
				});
				const ellipsis = Tag(currentNode, "...", tagStyle);
				super.addEllipsis(ellipsis, currentNode);
			});
		});
	}
}
