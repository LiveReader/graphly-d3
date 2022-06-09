
import * as Shape from "./shape/shape";
import { OnZoom } from "./shape/utils/LODStyle";
import { EmitEvent } from "./shape/utils/event";
import PathShape from "./shape/shapes/PathShape";
import SVGShape from "./shape/shapes/SVGShape";
import { TagStyle, TagShape } from "./shape/shapes/TagShape";
import TextShape from "./shape/shapes/TextShape";
import { Alignment, CollectionStyle, ShapeCollection } from "./shape/collections/ShapeCollection";
import TagCollection from "./shape/collections/TagCollection";
import TextCollection from "./shape/collections/TextCollection";
import "./styles/shapeStyles.scss";

export {
	// Shapes
	Shape,
	PathShape,
	SVGShape,
	TagShape,
	TextShape,
	// Styles
	TagStyle,
	CollectionStyle,
	// Collections
	Alignment,
	ShapeCollection,
	TagCollection,
	TextCollection,
	// LOD
	OnZoom,
	EmitEvent,
};

export * from "./shape/utils/styleModifier";
