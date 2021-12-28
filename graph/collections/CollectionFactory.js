const Alignment = {
	Left: "left",
	Center: "center",
	Right: "right",
};

/**
 * @param  {Number} height height of the text field
 * @param  {Number} width width of the text field
 * @param  {Number} x x position of the text field
 * @param  {Number} y y position of the text field
 * @param  {Number} dx x spacing between text elements
 * @param  {Number} dy y spacing between text elements
 * @param  {Number} rowCount number of rows
 * @param  {Allignment} align item alignment (left, center, right)
 * @param  {Number[]} rowMargins optional margins for each row
 */
function CollectionStyle(height, width, x, y, dx, dy, rowCount, align = Alignment.Center, rowMargins = []) {
	return {
		height: height,
		width: width,
		x: x,
		y: y,
		dx: dx,
		dy: dy,
		rowCount: rowCount,
		align: Object.values(Alignment).includes(align) ? align : Alignment.Center,
		rowMargins: rowMargins,
	};
}

class CollectionFactory extends ShapeFactory {
	#style;
	#items;
	#ellipsis;

	/**
	 * @param  {CollectionStyle} style
	 */
	constructor(simulation, style) {
		super(simulation);
		this.#style = style;
		this.#items = [];
		this.#ellipsis = {};
		return this;
	}

	addItem(shape, parent) {
		this.#items.push({
			shape: shape,
			parent: parent,
		});
		return this;
	}

	addEllipsis(shape, parent) {
		this.#ellipsis = {
			shape: shape,
			parent: parent,
		};
		return this;
	}

	#buildRows(shape, items) {
		const rowHeight = (this.#style.height - this.#style.dy * (this.#style.rowCount - 1)) / this.#style.rowCount;

		let itemStartIndex = 0;
		let skippedItems = [];

		for (let i = 0; i < this.#style.rowCount; i++) {
			const rowMargin = this.#style.rowMargins[i] || 0;
			const rowWidth = this.#style.width - rowMargin * 2;
			const row = shape
				.append("g")
				.attr("transform", `translate(${rowMargin}, ${(rowHeight + this.#style.dy) * i})`);
			itemStartIndex = this.#assambleRow(
				row,
				rowWidth,
				itemStartIndex,
				items,
				skippedItems,
				i == this.#style.rowCount - 1
			);
		}

		return this;
	}

	#assambleRow(row, rowWidth, itemStartIndex, items, skippedItems, isLastRow) {
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
			if (itemWidth > rowWidth) {
				itemShape.remove();
				itemIndex++;
				skippedItems.push(item);
				continue;
			}
			if (sumWidth + itemWidth > rowWidth) {
				itemShape.remove();
				if (isLastRow) {
					skippedItems.push(item);
				}
				break;
			}
			usedItems.push(itemShape);
			sumWidth += itemWidth + this.#style.dx;
			itemIndex++;
		}

		if (isLastRow && skippedItems.length > 0 && this.#ellipsis.shape) {
			row.node().appendChild(this.#ellipsis.shape);
			usedItems.push(this.#ellipsis.shape);
			sumWidth += this.#ellipsis.shape.getBBox().width + this.#style.dx;
		}

		sumWidth -= this.#style.dx;

		let sumItemWidth = 0;
		usedItems.forEach((item) => {
			let position = 0;
			if (this.#style.align === Alignment.Left) {
				position = sumItemWidth + item.getBBox().width / 2;
			} else if (this.#style.align == Alignment.Center) {
				position = sumItemWidth + item.getBBox().width / 2 + (rowWidth - sumWidth) / 2;
			} else if (this.#style.align == Alignment.Right) {
				position = rowWidth - sumItemWidth - item.getBBox().width / 2;
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
	render(data, onElement = (d) => {}) {
		const collection = data
			.append("g")
			.classed("collection", true)
			.attr("transform", `translate(${this.#style.x}, ${this.#style.y})`);
		super.assignLODRoutine(collection);
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
