import * as d3 from "d3";

export interface ShapeStyle {
	key: string;
	value: string;
	condition: (() => boolean) | boolean;
}

export interface LODStyle {
	shape: d3.Selection<SVGElement, any, any, any>;
	key: string;
	value: string;
	condition: ((k: number) => boolean) | boolean;
}

export function ShapeStyle(key: string, value: string, condition?: (() => boolean) | boolean): ShapeStyle {
	return {
		key: key,
		value: value,
		condition: condition ?? true,
	};
}

export function LODStyle(
	shape: d3.Selection<SVGElement, any, any, any>,
	key: string,
	value: string,
	condition?: ((k: number) => boolean) | boolean
): LODStyle {
	return {
		shape: shape,
		key: key,
		value: value,
		condition: condition ?? true,
	};
}

export function applyStyles(shape: d3.Selection<any, any, any, any>, styles: ShapeStyle[]) {
	styles.forEach((style: ShapeStyle) => {
		if (style.key === "class") {
			style.value.split(".").forEach((value: string) => {
				shape.classed(value, typeof style.condition === "function" ? style.condition() : style.condition);
			});
		}
		if (typeof style.condition === "function" ? style.condition() : style.condition) {
			shape.style(style.key, style.value);
		}
	});
}

export function applyLODStyles(k: number, styles: LODStyle[]) {
	styles.forEach((style: LODStyle) => {
		if (style.key === "class") {
			style.value.split(".").forEach((value: string) => {
				style.shape.classed(
					value,
					typeof style.condition === "function" ? style.condition(k) : style.condition
				);
			});
		}
		if (typeof style.condition === "function" ? style.condition(k) : style.condition) {
			style.shape.style(style.key, style.value);
		}
	});
}
