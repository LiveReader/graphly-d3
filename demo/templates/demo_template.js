const DemoTemplate = {
	shapeSize: 300,
	shapeBuilder: shapeBuilder,
};

function shapeBuilder(data, TemplateAPI) {
	const {
		Shape,
		SVGShape,
		ShapeStyle,
		OnZoom,
		LODStyle,
		Alignment,
		CollectionStyle,
		TextCollection,
		TagCollection,
		TagShape,
		TagStyle,
		FireEvent,
	} = TemplateAPI;

	const shape = Shape.create("g");

	const { body, border, state, diamond, largeDiamond } = addBaseShape();
	border.classed("gly-selectable", true);
	setState(state);
	const fullName = addFullName();
	const { initials, largeInitials } = addInitials();
	const sexIndicator = addSexIndicator();
	const ageIndicator = addAgeIndicator();
	const { accessibilityTag, largeAccessibilityTag } = addAccessibilityTag();
	const tagCollection = addTagCollection();

	OnZoom(data, 0.35, [
		LODStyle(largeDiamond, "class", "hidden", (k) => k > 0.35),
		LODStyle(largeInitials, "class", "hidden", (k) => k > 0.35),
		LODStyle(diamond, "class", "hidden", (k) => k < 0.35),
		LODStyle(initials, "class", "hidden", (k) => k > 0.7 || k < 0.35),
		LODStyle(largeAccessibilityTag, "class", "hidden", (k) => k > 0.7 || k < 0.35),
	]);
	OnZoom(data, 0.7, [
		LODStyle(tagCollection, "class", "hidden", (k) => k < 0.7),
		LODStyle(fullName, "class", "hidden", (k) => k < 0.7),
		LODStyle(sexIndicator, "class", "hidden", (k) => k < 0.7),
		LODStyle(ageIndicator, "class", "hidden", (k) => k < 0.7),
		LODStyle(initials, "class", "hidden", (k) => k > 0.7 || k < 0.35),
		LODStyle(largeAccessibilityTag, "class", "hidden", (k) => k > 0.7 || k < 0.35),
		LODStyle(accessibilityTag, "class", "hidden", (k) => k < 0.7),
	]);

	Shape.transform(shape, true, data.shape.scale * DemoTemplate.shapeSize);
	return shape;

	function addBaseShape() {
		const frame = SVGShape(`
			<g transform="matrix(1,0,0,1,-713.419,-878.793)">
				<g id="body" transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g transform="matrix(1,0,0,1,371.053,216.935)">
						<path d="M0,647.047C-11.004,647.047 -21.258,641.127 -26.76,631.598L-195.707,338.973C-201.208,329.443 -201.208,317.604 -195.707,308.074L-26.76,15.449C-21.257,5.92 -11.004,0 0,0L337.894,0C348.897,0 359.151,5.92 364.654,15.449L533.6,308.074C539.102,317.604 539.102,329.443 533.6,338.973L364.654,631.598C359.151,641.127 348.898,647.047 337.894,647.047L0,647.047Z" style="fill-rule:nonzero;"/>
					</g>
				</g>
				<g id="state" transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g transform="matrix(1,0,0,1,733.385,371.504)">
						<path d="M0,-142.023C-4.84,-150.405 -13.784,-155.569 -23.463,-155.569L-363.307,-155.569C-372.986,-155.569 -381.93,-150.405 -386.769,-142.023L-469.385,1.071C-383.992,9.12 -290.869,13.546 -193.385,13.546C-95.9,13.546 -2.778,9.12 82.615,1.071L0,-142.023Z";fill-rule:nonzero;stroke:rgb(165,164,165);stroke-width:1px;"/>
					</g>
				</g>
				<g id="diamond" transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g transform="matrix(1,0,0,1,528.976,242.61)">
						<path d="M0,284.631L-131.292,153.339C-137.38,147.251 -137.38,137.38 -131.292,131.292L0,0C6.088,-6.088 15.959,-6.088 22.047,0L153.339,131.292C159.427,137.38 159.427,147.251 153.339,153.339L22.047,284.631C15.959,290.719 6.088,290.719 0,284.631Z" style="fill-rule:nonzero;stroke:rgb(165,164,165);stroke-width:1px;"/>
					</g>
				</g>
				<g id="large-diamond" transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g transform="matrix(1.50118,0,0,1.50118,523.452,325.522)">
						<path d="M0,284.631L-131.292,153.339C-137.38,147.251 -137.38,137.38 -131.292,131.292L0,0C6.088,-6.088 15.959,-6.088 22.047,0L153.339,131.292C159.427,137.38 159.427,147.251 153.339,153.339L22.047,284.631C15.959,290.719 6.088,290.719 0,284.631Z" style="fill-rule:nonzero;stroke:rgb(165,164,165);stroke-width:1px;"/>
					</g>
				</g>
				<g id="border" transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g transform="matrix(1,0,0,1,708.947,864.483)">
						<path d="M0,-648.048L-337.894,-648.048C-349.112,-648.048 -359.477,-642.063 -365.086,-632.348L-534.033,-339.724C-539.642,-330.009 -539.642,-318.039 -534.033,-308.325L-365.086,-15.7C-359.477,-5.985 -349.112,0 -337.894,0L0,0C11.218,0 21.584,-5.985 27.193,-15.7L196.14,-308.325C201.748,-318.039 201.748,-330.009 196.14,-339.724L27.193,-632.348C21.584,-642.063 11.218,-648.048 0,-648.048M0,-647.048C10.826,-647.048 20.914,-641.224 26.327,-631.848L195.273,-339.224C200.686,-329.848 200.686,-318.2 195.273,-308.825L26.327,-16.2C20.914,-6.824 10.826,-1 0,-1L-337.894,-1C-348.72,-1 -358.807,-6.824 -364.22,-16.2L-533.167,-308.825C-538.58,-318.2 -538.58,-329.848 -533.167,-339.224L-364.22,-631.848C-358.807,-641.224 -348.72,-647.048 -337.894,-647.048L0,-647.048"/>
					</g>
				</g>
			</g>
			`);
		frame.classed("frame", true).classed("n_animated", true);
		shape.append(() => frame.node());
		const body = frame.select("#body");
		const border = frame.select("#border");
		const state = frame.select("#state");
		const diamond = frame.select("#diamond");
		const largeDiamond = frame.select("#large-diamond");
		return {
			body,
			border,
			state,
			diamond,
			largeDiamond,
		};
	}

	function setState(state) {
		const status = data.payload?.status ?? "unkown";
		state
			.classed("n_gray", false)
			.classed("lighten-3", false)
			.classed("n_gray", status === "deceased")
			.classed("darken-3", status === "deceased")
			.classed("n_red", status == "immediate")
			.classed("n_orange", status === "delayed")
			.classed("n_green", status === "minor");
		if (status != "deceased" && status != "immediate" && status != "delayed" && status != "minor") {
			state.classed("n_gray", true).classed("lighten-3", true);
		}
	}

	function addFullName() {
		if (!data.payload?.name) return shape.select("g.full-name");
		shape.select("g.full-name").remove();
		const bbox = Shape.getBBox(shape);
		const text = (data.payload?.name?.first ?? "") + "\n" + (data.payload?.name?.last ?? "");
		const placeholder = data.payload?.name?.first || data.payload?.name?.last ? null : "Vorname Nachname";
		const nameShape = TextCollection(
			placeholder ? placeholder : text,
			CollectionStyle(300, bbox.width, 0, bbox.height * 0.25, 80, 80, 2, Alignment.Center, [800, 800]),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "160", true),
				ShapeStyle("class", "n_dark_text", true),
				ShapeStyle("class", "n_gray.lighten-1", placeholder),
			]
		);
		nameShape.classed("full-name", true);
		shape.append(() => nameShape.node());
		return nameShape;
	}

	function addInitials() {
		if (!data.payload?.name) {
			return {
				initials: shape.select("g.initials"),
				largeInitials: shape.select("g.large-initials"),
			};
		}
		shape.select("g.initials").remove();
		const bbox = Shape.getBBox(shape);
		const text = (data.payload?.name?.first ?? "")[0] + (data.payload?.name?.last ?? "")[0];
		const placeholder = data.payload?.name?.first || data.payload?.name?.last ? null : "VN";

		const initials = TextCollection(
			placeholder ? placeholder : text,
			CollectionStyle(300, bbox.width, 0, bbox.height * 0.33, 80, 80, 1),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "440", true),
				ShapeStyle("class", "n_dark_text", true),
				ShapeStyle("class", "n_gray.lighten-1", placeholder),
			]
		);
		initials.classed("initials", true);
		shape.append(() => initials.node());

		shape.select("g.large-initials").remove();
		const largeInitials = TextCollection(
			placeholder ? placeholder : text,
			CollectionStyle(600, bbox.width, 0, bbox.height * 0.6, 80, 80, 1),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "680", true),
				ShapeStyle("class", "n_dark_text", true),
				ShapeStyle("class", "n_gray.lighten-1", placeholder),
			]
		);
		largeInitials.classed("large-initials", true);
		shape.append(() => largeInitials.node());
		return { initials, largeInitials };
	}

	function addSexIndicator() {
		if (!data.payload?.sex) return shape.select("g.sex-indicator");
		shape.select("g.sex-indicator").remove();
		const bbox = Shape.getBBox(shape);
		const text = data.payload?.sex[0].toUpperCase();
		const sexShape = TextCollection(
			text,
			CollectionStyle(300, bbox.width * 0.2, bbox.width * 0.2, bbox.height * 0.16, 80, 80, 1, Alignment.Center),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "280", true),
				ShapeStyle("class", "n_white", true),
				ShapeStyle("opacity", "0.5", true),
			]
		);
		sexShape.classed("sex-indicator", true);
		shape.append(() => sexShape.node());
		return sexShape;
	}

	function addAgeIndicator() {
		if (!data.payload?.age) return shape.select("g.age-indicator");
		shape.select("g.age-indicator").remove();
		const bbox = Shape.getBBox(shape);
		const text = data.payload?.age.toString() ?? "";
		const ageShape = TextCollection(
			text,
			CollectionStyle(300, bbox.width * 0.2, bbox.width * 0.6, bbox.height * 0.16, 80, 80, 1, Alignment.Center),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "280", true),
				ShapeStyle("class", "n_white", true),
				ShapeStyle("opacity", "0.5", true),
			]
		);
		ageShape.on("click", (e) => {
			FireEvent("age-click", data, e, text);
		});
		ageShape.classed("age-indicator", true);
		shape.append(() => ageShape.node());
		return ageShape;
	}

	function addAccessibilityTag() {
		if (!data.payload?.accessibility) {
			return {
				accessibilityTag: shape.select("g.accessibility-tag"),
				largeAccessibilityTag: shape.select("g.large-accessibility-tag"),
			};
		}
		const bbox = Shape.getBBox(shape);
		shape.select("g.accessibility-tag").remove();
		const accessibilityTag = TagShape(
			data.payload?.accessibility ?? " – ",
			TagStyle(
				[120, 40],
				[ShapeStyle("class", "n_text.n_white", true), ShapeStyle("font-size", "140", true)],
				[ShapeStyle("class", "n_black", true)],
				120
			)
		);
		accessibilityTag
			.classed("accessibility-tag", true)
			.attr("transform", `translate(${bbox.width / 2}, ${bbox.height * 0.6})`);
		shape.append(() => accessibilityTag.node());

		shape.select("g.large-accessibility-tag").remove();
		const largeAccessibilityTag = TagShape(
			data.payload?.accessibility ?? " – ",
			TagStyle(
				[160, 50],
				[ShapeStyle("class", "n_text.n_white", true), ShapeStyle("font-size", "180", true)],
				[ShapeStyle("class", "n_black", true)],
				160
			)
		);
		largeAccessibilityTag
			.classed("large-accessibility-tag", true)
			.attr("transform", `translate(${bbox.width / 2}, ${bbox.height * 0.65})`);
		shape.append(() => largeAccessibilityTag.node());
		return {
			accessibilityTag,
			largeAccessibilityTag,
		};
	}

	function addTagCollection() {
		shape.select("g.tag-collection").remove();
		const bbox = Shape.getBBox(shape);
		const tagCollection = TagCollection(
			data.payload?.tags ?? [],
			CollectionStyle(800, bbox.width, 0, bbox.height * 0.72, 60, 60, 3, Alignment.Center, [370, 540, 710]),
			TagStyle(
				[100, 40],
				[ShapeStyle("class", "n_text.n_dark_text", true), ShapeStyle("font-size", "120", true)],
				[ShapeStyle("class", "n_gray", true), ShapeStyle("class", "demo_template_tag_text", true)],
				110
			)
		);
		tagCollection.classed("tag-collection", true);
		shape.append(() => tagCollection.node());
		return tagCollection;
	}
}

export default DemoTemplate;
