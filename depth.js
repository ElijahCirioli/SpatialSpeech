const separation = 0.133;
const focalLength = 963.9;

const ratio = focalLength * separation;

const determineDepth = pairs => {
	let objects = [];

	pairs.forEach(p => {
		let horizontal;

		const leftOverflow = p.left.bbox[0] <= 5 || p.right.bbox[0] <= 5;
		const rightOverflow =
			p.left.bbox[0] + p.left.bbox[2] >= rightCanvas.width - 5 ||
			p.right.bbox[0] + p.right.bbox[2] >= rightCanvas.width - 5;

		if (leftOverflow && !rightOverflow) {
			horizontal = Math.abs(p.left.bbox[0] + p.left.bbox[2] - p.right.bbox[0] - p.right.bbox[2]);
		} else if (rightOverflow && !leftOverflow) {
			horizontal = Math.abs(p.left.bbox[0] - p.right.bbox[0]);
		} else {
			horizontal = Math.abs(p.left.pos.x - p.right.pos.x);
		}

		const distance = ratio / horizontal;
		const averagePos = new Vec((p.left.pos.x + p.right.pos.x) / 2, (p.left.pos.y + p.right.pos.y) / 2);

		objects.push({
			class: p.class,
			pair: p,
			depth: distance,
			pos: averagePos,
			inGroup: false
		});
	});

	return objects;
};
