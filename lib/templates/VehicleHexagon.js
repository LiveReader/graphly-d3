import Shape from "../shape/Shape.js";
import PathShape from "../shape/shapes/PathShape.js";
import ShapeStyle from "../shape/utils/ShapeStyle.js";
import { OnZoom, LODStyle } from "../shape/utils/LODStyle.js";
import { Alignment, CollectionStyle } from "../shape/collections/ShapeCollection.js";
import TextCollection from "../shape/collections/TextCollection.js";

VehicleHexagon.shapeSize = 300;

function VehicleHexagon(data, initialShape, changes) {
	const shape = initialShape ? initialShape : Shape.create("g");
	const bodyShape = addBody();
	const headShape = addHead();
	const titleShape = addTitle();
	const subtitleShape = addSubitle();
	const headlineShape = addHeadline();
	const largeTitleShape = addLargeTitle();

	OnZoom(data, 0.3, [
		LODStyle(bodyShape, "background", (k) => k > 0.3),
		LODStyle(bodyShape, "status", (k) => k < 0.3),
		LODStyle(bodyShape, "zero", (k) => data.status === "0" && k < 0.3),
		LODStyle(bodyShape, "one", (k) => data.status === "1" && k < 0.3),
		LODStyle(bodyShape, "two", (k) => data.status === "2" && k < 0.3),
		LODStyle(bodyShape, "three", (k) => data.status === "3" && k < 0.3),
		LODStyle(bodyShape, "four", (k) => data.status === "4" && k < 0.3),
		LODStyle(bodyShape, "five", (k) => data.status === "5" && k < 0.3),
		LODStyle(bodyShape, "six", (k) => data.status === "6" && k < 0.3),
		LODStyle(bodyShape, "seven", (k) => data.status === "7" && k < 0.3),
		LODStyle(bodyShape, "eight", (k) => data.status === "8" && k < 0.3),
		LODStyle(headlineShape, "hidden", (k) => k < 0.3),
		LODStyle(headShape, "hidden", (k) => k < 0.3),
		LODStyle(titleShape, "hidden", (k) => k < 0.3),
		LODStyle(subtitleShape, "hidden", (k) => k < 0.3),
		LODStyle(largeTitleShape, "hidden", (k) => k > 0.3),
	]);

	Shape.transform(shape, true, data.shape.scale * VehicleHexagon.shapeSize);
	return shape;

	function addBody() {
		const bodyShape = initialShape
			? shape.select("path.body")
			: PathShape(
					"M268.62,884C257.6,883.979 247.388,878.084 241.86,868.55L4.64,457.72C-0.852,448.166 -0.852,436.374 4.64,426.82L241.86,16C247.375,6.447 257.589,0.531 268.62,0.5L743.05,0.5C754.081,0.531 764.295,6.447 769.81,16L1007,426.82C1012.49,436.374 1012.49,448.166 1007,457.72L769.81,868.59C764.272,878.108 754.062,883.988 743.05,884L268.62,884Z"
			  );
		bodyShape.classed("body", true).classed("hexagon-vehicle", true).classed("background", true);
		if (!initialShape) {
			shape.append(() => bodyShape.node());
		}
		return bodyShape;
	}

	function addHead() {
		const headShape = initialShape
			? shape.select("path.head")
			: PathShape(
					"M318.483,0C318.483,0 318.407,143.503 318.359,232.359C318.339,270.326 349.059,301.142 387.025,301.241C454.452,301.416 556.745,301.682 624.393,301.858C642.738,301.905 660.344,294.629 673.302,281.644C686.261,268.658 693.501,251.038 693.416,232.692C693,143.517 692.332,0 692.332,0L318.483,0Z"
			  );
		headShape
			.classed("hexagon-vehicle", true)
			.classed("head", true)
			.classed("status", true)
			.classed("zero", data.status === "0")
			.classed("one", data.status === "1")
			.classed("two", data.status === "2")
			.classed("three", data.status === "3")
			.classed("four", data.status === "4")
			.classed("five", data.status === "5")
			.classed("six", data.status === "6")
			.classed("seven", data.status === "7")
			.classed("eight", data.status === "8")
			.classed("nine", data.status === "9");
		if (!initialShape) {
			shape.append(() => headShape.node());
		}
		return headShape;
	}

	function addTitle() {
		if (!changes.label) return shape.select("g.title");
		shape.select("g.title").remove();
		const bbox = Shape.getBBox(shape);
		const titleShape = TextCollection(
			data.label,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.6, 40, 40, 1),
			[ShapeStyle("hexagon-vehicle", true), ShapeStyle("title", true)]
		);
		titleShape.classed("title", true);
		shape.append(() => titleShape.node());
		return titleShape;
	}

	function addLargeTitle() {
		if (!changes.label) return shape.select("g.largeTitle");
		shape.select("g.largeTitle").remove();
		const bbox = Shape.getBBox(shape);
		const largeTitleShape = TextCollection(
			data.label,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.615, 40, 40, 1, Alignment.Center, [60]),
			[ShapeStyle("hexagon-vehicle", true), ShapeStyle("title", true), ShapeStyle("large", true)]
		);
		largeTitleShape.classed("largeTitle", true);
		shape.append(() => largeTitleShape.node());
		return largeTitleShape;
	}

	function addSubitle() {
		if (!changes.time) return shape.select("g.subtitle");
		shape.select("g.subtitle").remove();
		const bbox = Shape.getBBox(shape);
		const subtitleShape = TextCollection(
			data.time,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.7, 20, 40, 1),
			[ShapeStyle("hexagon-vehicle", true), ShapeStyle("subtitle", true)]
		);
		subtitleShape.classed("subtitle", true);
		shape.append(() => subtitleShape.node());
		return subtitleShape;
	}

	function addHeadline() {
		if (!changes.status) return shape.select("g.headline");
		shape.select("g.headline").remove();
		const bbox = Shape.getBBox(shape);
		const headlineShape = TextCollection(
			data.status,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.235, 40, 40, 1),
			[ShapeStyle("hexagon-vehicle", true), ShapeStyle("headline", true)]
		);
		headlineShape.classed("headline", true);
		shape.append(() => headlineShape.node());
		return headlineShape;
	}
}

export default VehicleHexagon;
