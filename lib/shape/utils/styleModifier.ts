import * as d3 from "d3";
import { Event, Node } from "../../main";

export interface ThemeStyle {
	data: Node;
	lightValue: string;
	darkValue: string;
}

export interface ShapeStyle {
	key: string;
	value: string | ThemeStyle;
	condition: (() => boolean) | boolean;
}

export interface LODStyle {
	shape: d3.Selection<any, any, any, any>;
	key: string;
	value: string;
	condition: ((k: number) => boolean) | boolean;
}

export function ThemeStyle(data: Node, lightValue: string, darkValue: string): ThemeStyle {
	return {
		data: data,
		lightValue: lightValue,
		darkValue: darkValue,
	};
}

export function ShapeStyle(key: string, value: string | ThemeStyle, condition?: (() => boolean) | boolean): ShapeStyle {
	return {
		key: key,
		value: value,
		condition: condition ?? true,
	};
}

export function LODStyle(
	shape: d3.Selection<any, any, any, any>,
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
		if (style.value instanceof Object) {
			applyStyle(
				shape,
				style.key,
				style.condition
			);
			if (!style.value.data.simulation) return;
			style.value.data.simulation.on(Event.ThemeChange, (theme: "light" | "dark") => {
				if (typeof style.value === "string") return;
				if (theme == "light") applyStyle(shape, style.key, style.value.lightValue, style.condition);
				else if (theme == "dark") applyStyle(shape, style.key, style.value.darkValue, style.condition);
			});
		} else {
			applyStyle(shape, style.key, style.value, style.condition);
		}
	});
}
function applyStyle(
	shape: d3.Selection<any, any, any, any>,
	key: string,
	value: string,
	condition: boolean | (() => boolean)
) {
	if (key === "class") {
		value.split(".").forEach((value: string) => {
			shape.classed(value, typeof condition === "function" ? condition() : condition);
		});
	}
	if (typeof condition === "function" ? condition() : condition) {
		shape.style(key, value);
	}
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
