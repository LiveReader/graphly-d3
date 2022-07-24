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

export function transform(
	shape: d3.Selection<SVGElement, any, any, any>,
	size: number
): { scale: number; translate: { x: number; y: number } } {
	const bbox = getBBox(shape);
	const scale = size / Math.max(bbox.width, bbox.height);
	const translate = {
		x: (-bbox.width * scale) / 2 || 0,
		y: (-bbox.height * scale) / 2 || 0,
	};
	shape.attr("transform", `translate(${translate.x}, ${translate.y}) scale(${scale || 1})`);
	return {
		scale: scale,
		translate: translate,
	};
}

export function Circle(radius: number): d3.Selection<SVGElement, any, any, any> {
	const shape = create("g");
	const circle = create("circle");
	circle.attr("r", radius);
	circle.attr("transform", `translate(${radius}, ${radius})`);
	shape.append(() => circle.node());
	return shape;
}

export function Rectangle(
	width: number,
	height: number,
	cornerRadius: number = 0
): d3.Selection<SVGElement, any, any, any> {
	const shape = create("g");
	const rect = create("rect");
	rect.attr("width", width);
	rect.attr("height", height);
	rect.attr("rx", cornerRadius);
	rect.attr("ry", cornerRadius);
	shape.append(() => rect.node());
	return shape;
}

export function Polygon(n: number, radius: number, curveRadius: number = 0): d3.Selection<SVGElement, any, any, any> {
	const shape = Circle(radius);
	shape.select("circle").attr("fill", "none");
	shape.select("circle").attr("stroke", "none");
	const path = create("path");
	const points: { x: number; y: number }[] = [];
	for (let i = 0; i < n; i++) {
		const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
		const x = Math.cos(angle) * radius;
		const y = Math.sin(angle) * radius;
		points.push({ x, y });
	}
	path.attr("d", roundedPath(points, curveRadius));
	path.attr("transform", `translate(${radius}, ${radius})`);
	shape.append(() => path.node());
	return shape;
}

function roundedPath(points: { x: number; y: number }[], radius: number): string {
	const path = [];
	points = points.slice();
	for (let i = 0; i < points.length; i++) {
		const c2i = i + 1 > points.length - 1 ? (i + 1) % points.length : i + 1;
		const c3i = i + 2 > points.length - 1 ? (i + 2) % points.length : i + 2;
		const c1 = points[i];
		const c2 = points[c2i];
		const c3 = points[c3i];

		const c1c2Dist = Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
		const c1c2DistRadio = (c1c2Dist - radius) / c1c2Dist;
		const c1c2CurvePoint = [
			((1 - c1c2DistRadio) * c1.x + c1c2DistRadio * c2.x).toFixed(1),
			((1 - c1c2DistRadio) * c1.y + c1c2DistRadio * c2.y).toFixed(1),
		];
		const c2c3Dist = Math.sqrt(Math.pow(c2.x - c3.x, 2) + Math.pow(c2.y - c3.y, 2));
		const c2c3DistRatio = radius / c2c3Dist;
		const c2c3CurvePoint = [
			((1 - c2c3DistRatio) * c2.x + c2c3DistRatio * c3.x).toFixed(1),
			((1 - c2c3DistRatio) * c2.y + c2c3DistRatio * c3.y).toFixed(1),
		];

		if (i === points.length - 1) {
			path.unshift("M" + c2c3CurvePoint.join(","));
		}
		path.push("L" + c1c2CurvePoint.join(","));
		path.push("Q" + c2.x + "," + c2.y + "," + c2c3CurvePoint.join(","));
	}
	path.push("Z");
	return path.join(" ");
}
