/**
 * @param  {string} className – the css class name
 * @param  {object} condition - the condition to check whether the style should be applied
 */
function ShapeStyle(className, condition) {
	condition = typeof condition === "function" ? condition : () => condition;
	return {
		className: className,
		condition: condition,
	};
}

class ShapeFactory {
	#pathComponents;

	constructor(shapeSize) {
		this.shapeSize = shapeSize;
		this.#pathComponents = [];
		return this;
	}

	setShapeSize(shapeSize) {
		this.shapeSize = shapeSize;
		return this;
	}

	/** add an svg component to the factory
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
		return this;
	}

	resizeShape(shape) {
		const bbox = shape.node().getBBox();
		const scale = this.size / bbox.width;
		shape.attr(
			"transform",
			`translate(${-(bbox.width * scale) / 2}, ${-(bbox.height * scale) / 2}) scale(${scale})`
		);
		return shape;
	}

	/** render the shape
	 * @param  {Object} data D3 data object
	 * @param  {Function} onElement function to be called on each element created on data
	 */
	render(data, onElement = {}) {
		data.selectAll("g").remove();
		const shape = data.append("g");
		shape.select((d) => {
			onElement(d);
		});
		this.assamble(shape);
		this.resizeShape(shape);
		return shape;
	}
}
