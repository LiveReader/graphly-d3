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

	addItem(shape, parent) {
		this.#items.push({
			shape: shape,
			parent: parent,
		});
		return this;
	}

	#buildRows(shape, items) {
		const rowHeight = (this.#style.height - this.#style.dy * (this.#style.rowCount - 1)) / this.#style.rowCount;

		let itemStartIndex = 0;

		for (let i = 0; i < this.#style.rowCount; i++) {
			const rowMargin = this.#style.rowMargins[i] || 0;
			const rowWidth = this.#style.width - rowMargin * 2;
			const row = shape
				.append("g")
				.attr("transform", `translate(${rowMargin}, ${(rowHeight + this.#style.dy) * i})`);
			itemStartIndex = this.#assambleRow(row, rowWidth, itemStartIndex, items);
		}

		return this;
	}

	#assambleRow(row, rowWidth, itemStartIndex, items) {
		const usedItems = [];
		let sumWidth = 0;
		let itemIndex = itemStartIndex;
		while (sumWidth < rowWidth) {
			let item = items[itemIndex];
			if (item == undefined) {
				break;
			}
			item = item.shape;
			const itemShape = row.node().appendChild(item);
			const itemWidth = itemShape.getBBox().width;
			if (sumWidth + itemWidth > rowWidth) {
				itemShape.remove();
				break;
			}
			usedItems.push(itemShape);
			sumWidth += itemWidth + this.#style.dx;
			itemIndex++;
		}

		let sumItemWidth = 0;
		usedItems.forEach((item) => {
			let position = 0;
			if (this.#style.align === "left") {
				position = sumItemWidth;
			} else if (this.#style.align == "center") {
				position = sumItemWidth + item.getBBox().width / 2 + (rowWidth - sumWidth) / 2;
			} else if (this.#style.align == "right") {
				position = rowWidth - sumItemWidth;
			}
			item.setAttribute("transform", `translate(${position}, 0)`);
			sumItemWidth += item.getBBox().width + this.#style.dx;
		});

		return itemIndex;
	}

	#assamble(shape, items) {
		this.#buildRows(shape, items);
		return this;
	}

	/** render the shape
	 * @param  {Object} data D3 data object
	 * @param  {Function} onElement function to be called on each element created on data
	 */
	render(data, onElement = () => {}) {
		data.select("g.collection").remove();
		const collection = data
			.append("g")
			.classed("collection", true)
			.attr("transform", `translate(${this.#style.x}, ${this.#style.y})`);
		collection.select((d) => {
			onElement(d);
		});
		const sortedItems = this.#items.map((item) => item.parent);
		const parents = [...new Set(sortedItems)];
		parents.forEach((parent) => {
			let id = "0";
			parent.select((d) => {
				id = d.id;
			});
			const parentNode = collection.filter((d) => d.id === id);
			const items = this.#items.filter((item) => item.parent === parent);
			this.#assamble(parentNode, items);
		});
		return collection;
	}
}
