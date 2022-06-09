import * as d3 from "d3";
import * as Shape from "../shape";

enum Alignment {
	Left = "left",
	Center = "center",
	Right = "right",
}

/**
 * @param  {Number} height
 * @param  {Number} width
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} dx x spacing between subshapes
 * @param  {Number} dy y spacing between subshapes
 * @param  {Number} rowCount
 * @param  {Alignment} align item alignment (left, center, right)
 * @param  {Number[]} rowMargins optional horizontal margins for each row
 */
function CollectionStyle(
	height: number,
	width: number,
	x: number,
	y: number,
	dx: number,
	dy: number,
	rowCount: number,
	align: Alignment = Alignment.Center,
	rowMargins: number[] = []
) {
	return {
		height: height,
		width: width,
		x: x,
		y: y,
		dx: dx,
		dy: dy,
		rowCount: rowCount,
		align: align,
		rowMargins: rowMargins,
	};
}

/**
 * @param  {object[]} shapes array of d3 selections
 * @param  {CollectionStyle} style collection style
 * @param  {object} ellipsis optional ellipsis shape
 * @return {object} shape
 */
function ShapeCollection(
	shapes: (d3.Selection<SVGElement, any, any, any> | string)[],
	style: any,
	ellipsis: d3.Selection<SVGElement, any, any, any> | null = null
): d3.Selection<SVGElement, any, any, any> {
	const collection = Shape.create("g")
		.classed("collection", true)
		.attr("transform", `translate(${style.x}, ${style.y})`);
	assamble();

	return collection;

	function assamble() {
		const rowHeight = (style.height - style.dy * (style.rowCount - 1)) / style.rowCount;
		let shapeIndex: number = 0;
		let skippedShapes: d3.Selection<SVGElement, any, any, any>[] = [];

		for (let i = 0; i < style.rowCount; i++) {
			if (shapeIndex > shapes.length - 1) return;
			const rowMargin = style.rowMargins[i] || 0;
			const rowWidth = style.width - rowMargin * 2;
			const row = collection
				.append("g")
				.attr("id", `row-${i}`)
				.attr("transform", `translate(${rowMargin}, ${(rowHeight + style.dy) * i})`);
			shapeIndex = assambleRow(row, rowWidth, shapeIndex, skippedShapes, i == style.rowCount - 1);
		}
	}

	function assambleRow(
		row: d3.Selection<SVGGElement, any, any, any>,
		width: number,
		shapeIndex: number,
		skippedShapes: d3.Selection<SVGElement, any, any, any>[],
		isLastRow: boolean
	): number {
		const items = [];
		let widthSum = 0;
		let index = shapeIndex;

		while (widthSum < width && index < shapes.length) {
			const shape = shapes[index];
			if (!shape) break;
			if (shape === "<break-line>") {
				index++;
				break;
			}
			if (typeof shape === "string") break;
			const itemWidth = Shape.getBBox(shape).width;
			if (itemWidth > width) {
				skippedShapes.push(shape);
				index++;
				continue;
			}
			if (widthSum + itemWidth < width) {
				items.push(shape);
				widthSum += itemWidth + style.dx;
				index++;
			} else {
				if (isLastRow) {
					skippedShapes.push(shape);
				}
				break;
			}
		}

		// Ellipsis
		if (ellipsis && skippedShapes.length > 0 && (index >= shapes.length || isLastRow)) {
			items.push(ellipsis);
			widthSum += Shape.getBBox(ellipsis).width + style.dx;
		}

		widthSum -= style.dx;

		let comulatedWidth = 0;
		items.forEach((item) => {
			const itemWidth = Shape.getBBox(item).width;
			let pos = 0;
			switch (style.align) {
				case Alignment.Left:
					pos = comulatedWidth + itemWidth / 2;
					break;
				case Alignment.Center:
					pos = comulatedWidth + itemWidth / 2 + (width - widthSum) / 2;
					break;
				case Alignment.Right:
					pos = width - comulatedWidth - itemWidth / 2;
					break;
			}
			item.attr("transform", `translate(${pos}, 0)`);
			row.append(() => item.node());
			comulatedWidth += itemWidth + style.dx;
		});
		return index;
	}
}

export { Alignment, CollectionStyle, ShapeCollection };
