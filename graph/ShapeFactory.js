/**
 * @param  {string} className the css class name
 * @param  {object} condition the condition to check whether the style should be applied
 */
function ShapeStyle(className, condition) {
	return {
		className: className,
		condition: typeof condition === "function" ? condition : () => condition,
		type: "style",
	};
}

/**
 * @param  {string} className the css class name
 * @param  {object} condition the condition to check whether the style should be applied
 */
function LODStyle(className, condition) {
	return {
		className: className,
		condition: typeof condition === "function" ? condition : () => condition,
		type: "lod",
	};
}

/**
 * @callback condition
 * @param    {object} d d3 data object
 * @returns  {boolean} true if the condition is met
 */
/**
 * @callback callback
 * @param    {object} d d3 data object
 * @param    {object} el html element reference
 */
/**
 * @callback interval
 * @param    {object} d d3 data object
 * @returns  {number} the interval in milliseconds
 */
/**
 * @callback condition check whether the routine should be applied
 * @callback callback the routine to be applied
 * @callback interval the interval in milliseconds
 */
function RefreshRoutine(condition = (d) => {}, callback = (d, el) => {}, interval = (d) => {}) {
	return {
		condition: typeof condition === "function" ? condition : () => condition,
		callback: callback,
		interval: typeof interval === "function" ? interval : () => interval,
	};
}

class ShapeFactory {
	#pathComponents;
	#subShapes;
	#lodStyles;
	#refreshRoutine;
	#onClick;

	constructor(simulation, shapeSize = null) {
		this.simulation = simulation;
		this.shapeSize = shapeSize;
		this.#pathComponents = [];
		this.#subShapes = [];
		this.#lodStyles = [];
		this.#refreshRoutine = RefreshRoutine(false, () => {}, 0);
		return this;
	}

	setShapeSize(shapeSize) {
		this.shapeSize = shapeSize;
		return this;
	}

	#resizeShape(element, shapeScale) {
		const bbox = element.node().getBBox();
		const scale =
			((this.shapeSize != null ? this.shapeSize : bbox.width) / bbox.width) *
			(isNaN(shapeScale) ? 1 : shapeScale);
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

	addLODstyle(style) {
		this.#lodStyles.push(style);
	}

	assignLODRoutine(shape) {
		this.#lodStyles.forEach((style) => {
			this.simulation.onZoom((k) => {
				shape.classed(style.className, (d) => {
					const scaled_k = k * d.shapeScale;
					return style.condition(d, scaled_k);
				});
			});
		});
		return this;
	}

	/**
	 * @param  {RefreshRoutine} routine the refresh routine
	 */
	setRefreshRoutine(routine) {
		this.#refreshRoutine = routine;
		return this;
	}

	#refresh(d, elementID, element, data = {}) {
		if (document.getElementById(elementID)) {
			const proceed = this.#refreshRoutine.callback(d, element, data) ?? true;
			setTimeout(() => {
				if (proceed) this.#refresh(d, elementID, element, data);
			}, this.#refreshRoutine.interval(d));
		}
	}

	setOnClick(callback = (e, d, el) => {}) {
		this.#onClick = callback;
		return this;
	}

	/** assamble the element with the factory components
	 * @param  {object} element d3 data object
	 * @return {object} d3 data object
	 */
	assamble(element) {
		this.#pathComponents.forEach((component) => {
			const shape = element.append("path");
			shape.attr("d", component.path);
			component.styles.forEach((style) => {
				if (style.type === "lod") {
					this.simulation.onZoom((k) => {
						shape.classed(style.className, (d) => {
							const scaled_k = k * d.shapeScale;
							return style.condition(d, scaled_k);
						});
					});
				} else {
					shape.classed(style.className, (d) => style.condition(d));
				}
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
		return element;
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
		this.assignLODRoutine(shape);
		this.assamble(shape);
		this.assambleSubShapes(shape);
		shape.select((d) => {
			const currentNode = shape.filter((el) => el.id === d.id);
			const elementID = this.#randomUUID();
			currentNode.attr("id", elementID);

			// refresh routine cycle
			if (this.#refreshRoutine.condition(d)) {
				this.#refresh(d, elementID, currentNode);
			}

			this.#resizeShape(currentNode, d.shapeScale);
			onElement(d);
		});

		// on click
		if (typeof this.#onClick === "function") {
			shape.on("click", (e, d) => {
				const currentNode = shape.filter((el) => el.id === d.id);
				this.#onClick(e, d, currentNode);
			});
		}

		return shape;
	}
}
