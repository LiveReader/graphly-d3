import * as d3 from "d3";

export function prerender(shape: d3.Selection<SVGElement, any, any, any>, onElement: (el: SVGGraphicsElement) => void) {
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

export function getBBox(shape: d3.Selection<SVGElement, any, any, any>): SVGRect {
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

export function create(type: string): d3.Selection<SVGElement, any, any, any> {
	return d3.select(document.createElementNS("http://www.w3.org/2000/svg", type));
}

export function transform(shape: d3.Selection<SVGElement, any, any, any>, size: number) {
	const bbox = getBBox(shape);
	const scale = size / Math.max(bbox.width, bbox.height);
	const translate = {
		x: (-bbox.width * scale) / 2 || 0,
		y: (-bbox.height * scale) / 2 || 0,
	};
	shape.attr("transform", `translate(${translate.x}, ${translate.y}) scale(${scale || 1})`);
}

export function Circle(radius: number): d3.Selection<SVGElement, any, any, any> {
	const shape = create("g");
	const circle = create("circle");
	circle.attr("r", radius);
	circle.attr("transform", `translate(${radius}, ${radius})`);
	shape.append(() => circle.node());
	return shape;
}
