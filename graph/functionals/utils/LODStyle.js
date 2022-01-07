function OnZoom(data, threshold, styles = []) {
	const id = `${data.id}-${threshold}`; // Math.random().toString(36).substring(7);
	const simulation = new ForceSimulation();
	const globalThreshold = threshold / (isNaN(data.shape.scale) ? 1 : data.shape.scale);
	simulation.registerOnZoom(id, globalThreshold, (k) => {
		if (!document.getElementById(data.id)) {
			simulation.deregisterOnZoom(id);
			return;
		}
		const relativeScale = k * (isNaN(data.shape.scale) ? 1 : data.shape.scale);
		styles.forEach((style) => {
			if (!style) return;
			style.shape.classed(style.className, style.condition(relativeScale));
		});
	});
}

/**
 * @callback condition
 * @param  {Number} k scale factor
 * @return {Boolean}  condition
 */
/**
 * @param  {Object} shape D3 selection
 * @param  {String} className css class
 * @callback condition
 * @return {Object} style object
 */
function LODStyle(shape, className, condition = (k) => {}) {
	if (!shape) {
		console.log(shape, className, condition);
		return undefined
	}
	return {
		shape: shape,
		className: className,
		condition: condition,
	};
}
