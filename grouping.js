//maximum distance in world space that objects can be apart to be grouped
const distanceCutoff = 1.5;

//group nearby objects of the same type together
const group = objects => {
	//create an array of groups of objects
	let groups = [];
	objects.forEach(self => {
		if (!self.inGroup) {
			let selfGroup = [self];
			findClose(self, selfGroup, objects);
			groups.push(selfGroup);
		}
	});

	//wrap the groups with relevant information
	let wrappedGroups = [];
	groups.forEach(g => {
		let averageDepth = 0;
		let averagePos = new Vec(0, 0);
		g.forEach(obj => {
			averageDepth += obj.depth;
			averagePos.x += obj.pos.x;
			averagePos.y += obj.pos.y;
		});
		averageDepth /= g.length;
		averagePos = new Vec(averagePos.x / g.length, averagePos.y / g.length);

		wrappedGroups.push({ class: g[0].class, objects: g, depth: averageDepth, pos: averagePos, size: g.length });
	});

	return wrappedGroups;
};

//recursively check all neighbors to see if they meet criteria
const findClose = (self, group, objects) => {
	self.inGroup = true;
	objects.forEach(other => {
		if (self !== other && !other.inGroup && self.class === other.class) {
			if (distance(self.realPos, other.realPos) <= distanceCutoff) {
				group.push(other);
				findClose(other, group, objects);
			}
		}
	});
};
