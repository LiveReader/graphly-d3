/**
 * @param  {string} key the shape attribute key
 * @param  {string} value the shape attribute value
 * @param  {object} condition the condition to check whether the style should be applied
 */
function ShapeStyle(key, value, condition) {
	return {
		key: key,
		value: value,
		condition: typeof condition === "function" ? condition : () => condition,
	};
}

export default ShapeStyle;
