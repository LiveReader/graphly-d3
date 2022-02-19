function OnZoom(data, threshold, styles = []) {
	const id = `${data.id}-${threshold}`; // Math.random().toString(36).substring(7);
	const globalThreshold = threshold / (isNaN(data.shape.scale) ? 1 : data.shape.scale);
	data.forceSimulation.registerOnZoom(id, globalThreshold, (k) => {
		if (!document.getElementById(data.id)) {
			data.forceSimulation.deregisterOnZoom(id);
			return;
		}
		const relativeScale = k * (isNaN(data.shape.scale) ? 1 : data.shape.scale);
		styles.forEach((s) => {
			if (!s) return;
			if (s.key == "class") {
				s.value.split(".").forEach((c) => {
					s.shape.classed(c, s.condition());
				});
			} else if (s.condition(relativeScale)) {
				s.shape.style(s.key, s.value);
			}
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
 * @param  {string} key the shape attribute key
 * @param  {string} value the shape attribute value
 * @callback condition
 * @return {Object} style object
 */
function LODStyle(shape, key, value, condition = () => {}) {
	if (!shape) {
		return undefined;
	}
	return {
		shape: shape,
		key: key,
		value: value,
		condition: condition,
	};
}

export { OnZoom, LODStyle };
