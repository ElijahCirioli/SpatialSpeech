let processing;

const setup = () => {
	processing = true;
	setupModel();
	setupCameras();
};

const main = async () => {
	await shutter();

	const leftPredictions = new Promise((resolve, reject) => {
		resolve(analyze(leftCanvas));
		reject;
	});
	const rightPredictions = new Promise((resolve, reject) => {
		resolve(analyze(rightCanvas));
		reject;
	});

	const pairs = await Promise.all([leftPredictions, rightPredictions]).then(vals => {
		return match(vals[0], vals[1]);
	});

	const objects = determineDepth(pairs);

	const groups = group(objects);

	listObjects(groups);

	processing = false;
};

document.onmousedown = e => {
	e = window.event || e;
	e.preventDefault();

	if (!processing) {
		processing = true;
		main();
	}
};

const shutterSound = new Audio();
shutterSound.src = "./shutter_click.mp3";

window.onload = setup();
