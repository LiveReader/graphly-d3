/**
 * @param  {Number} height height of the text field
 * @param  {Number} width width of the text field
 * @param  {Number} x x position of the text field
 * @param  {Number} y y position of the text field
 * @param  {Number} dx x spacing between text elements
 * @param  {Number} dy y spacing between text elements
 * @param  {Number} rowCount number of rows
 * @param  {string} align item alignment (left, center, right)
 * @param  {Number[]} rowMargins optional margins for each row
 */
function CollectionStyle(height, width, x, y, dx, dy, rowCount, align = "center", rowMargins = []) {
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

class CollectionFactory extends ShapeFactory {
	#style;
	#items;

	/**
	 * @param  {CollectionStyle} style
	 */
	constructor(style) {
		super();
		this.#style = style;
		this.#items = [];
		return this;
	}

	addItem(shape) {
		this.#items.push(shape);
		return this;
	}

	#buildRows(collection) {
		const rowHeight = (this.#style.height - this.#style.dy * (this.#style.rowCount - 1)) / this.#style.rowCount;

		const container = collection.append("g");
		let itemStartIndex = 0;

		for (let i = 0; i < this.#style.rowCount; i++) {
			const rowMargin = this.#style.rowMargins[i] || 0;
			const rowWidth = this.#style.width - rowMargin * 2;
			const row = container
				.append("g")
				.attr("transform", `translate(${rowMargin}, ${(rowHeight + this.#style.dy) * i})`);
			itemStartIndex = this.#assambleRow(row, rowWidth, itemStartIndex);
		}

		return this;
	}

	#assambleRow(row, rowWidth, itemStartIndex) {
		const items = [];
		let sumWidth = 0;
		let itemIndex = itemStartIndex;
		while (sumWidth < rowWidth) {
			const item = this.#items[itemIndex];
			if (item == undefined) {
				break;
			}
			const itemShape = row.appendChild(item);
			const itemWidth = itemShape.node().getBBox().width;
			if (sumWidth + itemWidth > rowWidth) {
				itemShape.remove();
				break;
			}
			items.push(itemShape);
			sumWidth += itemWidth + this.#style.dx;
			itemIndex++;
		}

		let sumItemWidth = 0;
		items.forEach((item) => {
			let position = 0;
			if (this.#style.align === "left") {
				position = sumItemWidth;
			} else if (this.#style.align == "center") {
				position = sumItemWidth + item.node().getBBox().width / 2 + (rowWidth - sumWidth) / 2;
			} else if (this.#style.align == "right") {
				position = rowWidth - sumItemWidth;
			}
			item.attr("transform", `translate(${position}, 0)`);
			sumItemWidth += item.node().getBBox().width + this.#style.dx;
		});

		return itemIndex;
	}

	#assamble(collection) {
		this.#buildRows(collection);
		return this;
	}

	/** render the shape
	 * @param  {Object} data D3 data object
	 * @param  {Function} onElement function to be called on each element created on data
	 */
	render(data, onElement = () => {}) {
		data.selectAll("g").remove();
		const collection = data.append("g");
		collection.select((d) => {
			onElement(d);
		});
		this.#assamble(collection);
		return collection;
	}
}
