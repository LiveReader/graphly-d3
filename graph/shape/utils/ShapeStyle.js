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
