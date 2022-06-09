import * as Shape from "./shape/shape";
import "./styles/shapeStyles.scss";

export { Shape };

export * from "./shape/utils/styleModifier";

// shapes
export * from "./shape/shapes/PathShape";
export * from "./shape/shapes/SVGShape";
export * from "./shape/shapes/TagShape";
export * from "./shape/shapes/TextShape";

// collections
export * from "./shape/collections/ShapeCollection";
export * from "./shape/collections/TextCollection";
export * from "./shape/collections/TagCollection";

// lod
export * from "./shape/utils/levelOfDetail";

// events
export * from "./shape/utils/event";
