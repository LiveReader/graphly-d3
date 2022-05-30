import * as d3 from "d3";

function prerender(shape: d3.Selection<SVGElement, any, any, any>, onElement: (el: SVGGraphicsElement) => void) {
	if (!document.getElementById("PRERENDER_SVG")) {
		let el: SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		el.setAttribute("id", "PRERENDER_SVG");
		el.setAttribute("pointer-events", "none");
		el.setAttribute("width", "0");
		el.setAttribute("height", "0");
		el.setAttribute("style", "opacity: 0;");
		document.body.appendChild(el);
	}
	let svg: HTMLElement = document.getElementById("PRERENDER_SVG") as HTMLElement;
	svg.innerHTML = shape.html();
	onElement(svg.children[0] as SVGGraphicsElement);
	svg.innerHTML = "";
}

function getBBox(shape: d3.Selection<SVGElement, any, any, any>): SVGRect {
	let bbox: SVGRect = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	} as SVGRect;
	prerender(shape, (el: SVGGraphicsElement) => {
		bbox = el.getBBox();
	});
	return bbox;
}

function create(type: string): d3.Selection<SVGElement, any, any, any> {
	return d3.select(document.createElementNS("http://www.w3.org/2000/svg", type));
}

function transform(shape: d3.Selection<SVGElement, any, any, any>, centered: boolean, size: number) {
	const bbox = getBBox(shape);
	const scale = size / Math.max(bbox.width, bbox.height);
	const translate = centered
		? { x: (-bbox.width * scale) / 2 || 0, y: (-bbox.height * scale) / 2 || 0 }
		: { x: 0, y: 0 };
	shape.attr("transform", `translate(${translate.x}, ${translate.y}) scale(${scale || 1})`);
}

function alreadyExists(reference: HTMLElement) {
	const node: any = d3.select(reference).node();
	if (!node) return false;
	return typeof node.getAttribute === "function";
}

function cleanData(data: any): any {
	const bind = Object.assign({}, data);
	delete bind.x;
	delete bind.y;
	delete bind.vx;
	delete bind.vy;
	delete bind.index;
	delete bind.forceSimulation;
	delete bind.anchor;
	delete bind.satellite;
	return bind;
}

function bind(shape: d3.Selection<SVGElement, any, any, any>, data: any) {
	shape.attr("data-bind", JSON.stringify(cleanData(data)));
}

function getData(shape: d3.Selection<SVGElement, any, any, any>) {
	return JSON.parse(shape.attr("data-bind"));
}

function hasData(shape: d3.Selection<SVGElement, any, any, any>) {
	return !!shape.attr("data-bind");
}

function dataChanges(shape: d3.Selection<SVGElement, any, any, any>, data: any) {
	if (!hasData(shape)) {
		return Object.assign({}, cleanData(data));
	}
	const prevData = getData(shape);
	if (JSON.stringify(cleanData(prevData)) !== JSON.stringify(cleanData(data))) {
		return getChanges(cleanData(data), prevData);
	}
	return null;
}

function getChanges(a: any, b: any): any {
	if (!a || !b) return {};
	if (typeof a !== "object" || typeof b !== "object") return {};
	const changes: any = {};
	Object.keys(a).forEach((key) => {
		if (typeof a[key] == "object" && !Array.isArray(a[key])) {
			const c = getChanges(a[key], b[key]);
			Object.keys(c).length > 0 ? (changes[key] = c) : null;
		} else if (Array.isArray(a[key])) {
			const c = JSON.stringify(a[key]) !== JSON.stringify(b[key]) ? a[key] : [];
			c.length > 0 ? (changes[key] = c) : null;
		} else if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
			changes[key] = a[key];
		}
	});
	return changes;
}

export default {
	prerender,
	getBBox,
	create,
	transform,
	alreadyExists,
	cleanData,
	bind,
	getData,
	hasData,
	dataChanges,
	getChanges,
};
