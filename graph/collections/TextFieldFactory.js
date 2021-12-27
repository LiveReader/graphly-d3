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

class TextFieldFactory extends CollectionFactory {
	/**
	 * @callback onElement
	 * @param    {object} data D3 data object
	 * @return   {string} text to be rendered
	 */
	/**
	 * @param  {Object} shape d3 data object
	 * @param  {CollectionStyle} collectionStyle the collection style
	 * @param  {ShapeStyle[]} textStyles the styles for the text
	 * @callback onElement onElement function to be called on each element created on data
	 */
	constructor(
		simulation,
		shape,
		collectionStyle,
		textStyles,
		onElement = (el) => {
			return "";
		}
	) {
		super(simulation, collectionStyle);

		shape.select((d) => {
			const currentNode = shape.filter((el) => el.id === d.id);
			currentNode.select((el) => {
				const text = typeof onElement(el) === "string" ? onElement(el) : "";
				const words = text.split(" ");
				words.forEach((word) => {
					const textElement = Text(currentNode, word, textStyles);
					super.addItem(textElement, currentNode);
				});
				const ellipsis = Text(currentNode, "...", textStyles);
				super.addEllipsis(ellipsis, currentNode);
			});
		});
	}
}
