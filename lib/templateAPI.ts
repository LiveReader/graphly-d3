
import * as Shape from "./shape/shape";
import { Alignment, CollectionStyle, ShapeCollection } from "./shape/collections/ShapeCollection";
import TagCollection from "./shape/collections/TagCollection";
import TextCollection from "./shape/collections/TextCollection";
import "./styles/shapeStyles.scss";

export {
	Shape,
	// Styles
	CollectionStyle,
	// Collections
	Alignment,
	ShapeCollection,
	TagCollection,
	TextCollection,
};

export * from "./shape/utils/styleModifier";

// shapes
export * from "./shape/shapes/PathShape";
export * from "./shape/shapes/SVGShape";
export * from "./shape/shapes/TagShape";
export * from "./shape/shapes/TextShape";

// collections

// lod
export * from "./shape/utils/levelOfDetail";

// events
export * from "./shape/utils/event";
