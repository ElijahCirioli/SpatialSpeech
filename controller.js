let processing;

const setup = () => {
	processing = true;
	setupMap();
	setupModel();
	setupCameras();
};

//read depth and direction of all objects in images
const objectDetection = async () => {
	//take left and right pictures
	await shutter();

	//run tensorflow coco ssd on each image asynchronously
	const leftPredictions = new Promise((resolve, reject) => {
		resolve(analyze(leftCanvas));
		reject;
	});
	const rightPredictions = new Promise((resolve, reject) => {
		resolve(analyze(rightCanvas));
		reject;
	});

	//determine which objects are the same across images
	const pairs = await Promise.all([leftPredictions, rightPredictions]).then(vals => {
		return match(vals[0], vals[1]);
	});

	//determine the depth of all objects
	const objects = determineDepth(pairs);

	//draw the different objects in 3D space on a radar-like map
	drawMap(objects);

	//group nearby objects of the same type
	const groups = group(objects);

	//speak objects aloud
	listObjects(groups);

	processing = false;
};

//read all text in image aloud
const textRecognition = async () => {
	//take image from right camera
	const rightImage = await getImage(1);
	shutterSound.play();

	//draw image to right canvas
	drawCanvas(rightCanvas, rightImage, 1);

	//detect all text from right canvas and read aloud
	await findText(rightCanvas);

	processing = false;
};

//on mouse click
document.onmousedown = e => {
	e = window.event || e;
	e.preventDefault();

	let isRightClick;
	if ("which" in e) {
		isRightClick = e.which == 3;
	} else if ("button" in e) {
		isRightClick = e.button == 2;
	}

	if (!processing) {
		processing = true;
		if (isRightClick) {
			textRecognition();
		} else {
			objectDetection();
		}
	}
};

//prevent right click menu
document.oncontextmenu = e => {
	return false;
};

const shutterSound = new Audio();
shutterSound.src = "./shutter_click.mp3";

window.onload = setup();
