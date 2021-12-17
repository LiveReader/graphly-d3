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

	constructor() {
		this.#pathComponents = [];
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
}
