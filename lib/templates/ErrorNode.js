ErrorNode.shapeSize = 200;

function ErrorNode(data, Template) {
	const { Shape } = Template;

	const shape = Shape.create("g");
	shape
		.append("circle")
		.attr("r", ErrorNode.shapeSize / 2)
		.attr("fill", "#ff4040");

	Shape.transform(shape, false, data.shape.scale * ErrorNode.shapeSize);
	return shape;
}

export default ErrorNode;
