/**
 * @param  {string} className the css class name
 * @param  {object} condition the condition to check whether the style should be applied
 */
function ShapeStyle(className, condition) {
	return {
		className: className,
		condition: typeof condition === "function" ? condition : () => condition,
	};
}

class ShapeFactory {
	#pathComponents;
	#subShapes;

	constructor(shapeSize = null) {
		this.shapeSize = shapeSize;
		this.#pathComponents = [];
		this.#subShapes = [];
		return this;
	}

	setShapeSize(shapeSize) {
		this.shapeSize = shapeSize;
		return this;
	}

	#resizeShape(element) {
		const bbox = element.node().getBBox();
		const scale = (this.shapeSize != null ? this.shapeSize : bbox.width) / bbox.width;
		element.attr(
			"transform",
			`translate(${-(bbox.width * scale) / 2}, ${-(bbox.height * scale) / 2}) scale(${scale})`
		);
		return element;
	}

	/** add a svg component to the factory
	 * @param  {string} path
	 * @param  {ShapeStyle[]} styles
	 * @return {ShapeFactory}
	 */
	addPathComponent(path, styles) {
		this.#pathComponents.push({
			path: path,
			styles: styles,
		});
		return this;
	}

	/** add a sub shape to the factory
	 * @param  {ShapeFactory} subShape the sub shape
	 * @return {ShapeFactory}
	 */
	addSubShape(subShape) {
		this.#subShapes.push(subShape);
		return this;
	}

	/** assamble the element with the factory components
	 * @param  {} element
	 * @return {ShapeFactory}
	 */
	assamble(element) {
		this.#pathComponents.forEach((component) => {
			const shape = element.append("path");
			shape.attr("d", component.path);
			component.styles.forEach((style) => {
				shape.classed(style.className, (d) => style.condition(d));
			});
		});
		return element;
	}

	/**
	 * @param  {object} element d3 data object
	 * @return {object} d3 data object
	 */
	assambleSubShapes(element) {
		this.#subShapes.forEach((subShape) => {
			subShape.render(element);
		});
		return element
	}

	#randomUUID() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	/** render the shape
	 * @param  {Object} data D3 data object
	 * @param  {Function} onElement function to be called on each element created on data
	 */
	render(data, onElement = () => {}) {
		data.selectAll("g.shape").remove();
		const shape = data.append("g").classed("shape", true);
		this.assamble(shape);
		this.assambleSubShapes(shape);
		shape.select((d) => {
			const currentNode = shape.filter((el) => el.id === d.id);
			currentNode.attr("id", this.#randomUUID());
			onElement(d);
		});
		this.#resizeShape(shape);
		return shape;
	}
}
