const classWeight = 1000; //amount of distinction to add if objects are different types
const positionWeight = 0.7; //weight of distance between objects
const relationWeight = 0.3; //weight of distance between sum of relational vectors
const sizeWeight = 500; //weight of size ratio of objects

//add relevant properties to all objects in preparation for matching
const setupMatch = (left, right) => {
	left.forEach(l => {
		l.pos = new Vec(l.bbox[0] + l.bbox[2] / 2, l.bbox[1] + l.bbox[3] / 2);
		l.area = l.bbox[2] * l.bbox[3];
	});

	left.forEach(l => {
		l.rel = left.reduce((acc, obj) => {
			return new Vec(acc.x + obj.pos.x - l.pos.x, acc.y + obj.pos.y - l.pos.y);
		}, new Vec(0, 0));
	});

	right.forEach(r => {
		r.pos = new Vec(r.bbox[0] + r.bbox[2] / 2, r.bbox[1] + r.bbox[3] / 2);
		r.area = r.bbox[2] * r.bbox[3];
	});

	right.forEach(r => {
		r.rel = right.reduce((acc, obj) => {
			return new Vec(acc.x + obj.pos.x - r.pos.x, acc.y + obj.pos.y - r.pos.y);
		}, new Vec(0, 0));
	});
};

//take one list per eye and determine which objects are the same
const match = (leftObjs, rightObjs) => {
	let pairs = [];

	//if one eye has nothing
	if (rightObjs.length === 0 || leftObjs.length === 0) {
		return pairs;
	}

	setupMatch(leftObjs, rightObjs);

	//give each object from the right eye a list of left eye objects and a distinction score
	rightObjs.forEach(r => {
		r.matches = [];

		leftObjs.forEach(l => {
			const positionDistinction = positionWeight * distance(r.pos, l.pos);
			const relationDistinction = relationWeight * distance(r.rel, l.rel);

			let sizeDistinction = 0;
			if (r.area > l.area) {
				sizeDistinction = (r.area / l.area - 1) * sizeWeight;
			} else {
				sizeDistinction = (l.area / r.area - 1) * sizeWeight;
			}

			let classDistinction = 0;
			if (r.class !== l.class) {
				classDistinction = classWeight;
			}

			const distinction = positionDistinction + relationDistinction + sizeDistinction + classDistinction;

			r.matches.push({
				obj: l,
				score: distinction
			});
		});

		//sort matches by lowest distinction to highest
		r.matches.sort((a, b) => {
			return a.score - b.score;
		});
	});

	//create pairs by checking if another right object has a lower score for the current right object's best match
	rightObjs.forEach(self => {
		const closest = self.matches[0];
		let bestChoice = true;

		rightObjs.forEach(other => {
			other.matches.forEach(trial => {
				if (trial.obj === closest.obj && trial.score < closest.score) {
					bestChoice = false;
				}
			});
		});

		if (bestChoice) {
			pairs.push({ class: self.class, right: self, left: closest.obj });
		}
	});

	return pairs;
};

//return distance between two vectors
const distance = (v1, v2) => {
	return Math.sqrt((v2.x - v1.x) * (v2.x - v1.x) + (v2.y - v1.y) * (v2.y - v1.y));
};
