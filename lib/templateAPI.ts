
import * as Shape from "./shape/shape";
import TagCollection from "./shape/collections/TagCollection";
import TextCollection from "./shape/collections/TextCollection";
import "./styles/shapeStyles.scss";

export {
	Shape,
	// Collections
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
export * from "./shape/collections/ShapeCollection";

// lod
export * from "./shape/utils/levelOfDetail";

// events
export * from "./shape/utils/event";
