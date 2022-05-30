import Shape from "./shape/Shape";
import ShapeStyle from "../lib/shape/utils/ShapeStyle";
import { OnZoom, LODStyle } from "./shape/utils/LODStyle";
import PathShape from "../lib/shape/shapes/PathShape";
import SVGShape from "../lib/shape/shapes/SVGShape";
import { TagStyle, TagShape } from "../lib/shape/shapes/TagShape";
import TextShape from "../lib/shape/shapes/TextShape";
import { Alignment, CollectionStyle, ShapeCollection } from "../lib/shape/collections/ShapeCollection";
import TagCollection from "../lib/shape/collections/TagCollection";
import TextCollection from "../lib/shape/collections/TextCollection";
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
