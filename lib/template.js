import Shape from "./shape/Shape.js";
import ShapeStyle from "../lib/shape/utils/ShapeStyle.js";
import { OnZoom, LODStyle } from "../lib/shape/utils/LODStyle.js";
import PathShape from "../lib/shape/shapes/PathShape.js";
import SVGShape from "../lib/shape/shapes/SVGShape.js";
import { TagStyle, TagShape } from "../lib/shape/shapes/TagShape.js";
import TextShape from "../lib/shape/shapes/TextShape.js";
import { Alignment, CollectionStyle, ShapeCollection } from "../lib/shape/collections/ShapeCollection.js";
import TagCollection from "../lib/shape/collections/TagCollection.js";
import TextCollection from "../lib/shape/collections/TextCollection.js";
import "./styles/shapeStyles.scss";

export {
	// Shapes
	Shape,
	PathShape,
	SVGShape,
	TagShape,
	TextShape,
	// Styles
	ShapeStyle,
	TagStyle,
	CollectionStyle,
	// Collections
	Alignment,
	ShapeCollection,
	TagCollection,
	TextCollection,
	// LOD
	OnZoom,
	LODStyle,
};
