const mapCanvas = document.getElementById("map-canvas");

const fov = (54 * Math.PI) / 180;
let glassesImage;

const setupMap = () => {
	glassesImage = new Image();
	glassesImage.onload = drawMap([]);
	glassesImage.src = "glasses_icon.png";
};

const drawMap = objects => {
	const context = mapCanvas.getContext("2d");
	const width = mapCanvas.width;
	const height = mapCanvas.height;
	const mRadius = 65;

	context.restore();

	//draw thick arc line
	context.strokeStyle = "#233f5c";
	context.fillStyle = "white";
	context.lineWidth = 3;
	context.fillRect(0, 0, width, height);
	context.save();
	context.translate(width / 2, height - 50);
	context.beginPath();
	context.moveTo(0, 0);
	context.arc(0, 0, mRadius * 8, (-Math.PI - fov) / 2, (-Math.PI + fov) / 2);
	context.closePath();
	context.stroke();

	//draw outer arc line and labels
	context.lineWidth = 2;
	context.textAlign = "center";
	context.font = "16px Arial";
	for (let i = 1; i < 8; i++) {
		context.fillStyle = "#233f5c";
		context.beginPath();
		context.arc(0, 0, mRadius * i, (-Math.PI - fov) / 2, (-Math.PI + fov) / 2);
		context.stroke();
		context.fillStyle = "black";
		context.fillText(
			i + "m",
			mRadius * i * Math.cos((-Math.PI - fov) / 2) - 22,
			mRadius * i * Math.sin((-Math.PI - fov) / 2) + 8
		);
		context.fillText(
			i + "m",
			mRadius * i * Math.cos((-Math.PI + fov) / 2) + 22,
			mRadius * i * Math.sin((-Math.PI + fov) / 2) + 8
		);
	}
	context.fillText(
		"8m",
		mRadius * 8 * Math.cos((-Math.PI - fov) / 2) - 22,
		mRadius * 8 * Math.sin((-Math.PI - fov) / 2) + 8
	);
	context.fillText(
		"8m",
		mRadius * 8 * Math.cos((-Math.PI + fov) / 2) + 22,
		mRadius * 8 * Math.sin((-Math.PI + fov) / 2) + 8
	);

	objects.forEach(obj => {
		const img = new Image();
		img.onload = () => {
			context.drawImage(
				img,
				0,
				0,
				img.width,
				img.height,
				obj.realPos.x * mRadius - 15,
				-obj.realPos.y * mRadius - 15,
				30,
				30
			);
		};

		const index = iconIds.filter(iconObj => obj.class === iconObj.class)[0].id;
		img.src = `./icons/${index}.jpg`;
	});

	context.drawImage(glassesImage, -20, -6);
};

const iconIds = [
	{ id: 1, class: "person" },
	{ id: 2, class: "bicycle" },
	{ id: 3, class: "car" },
	{ id: 4, class: "motorcycle" },
	{ id: 5, class: "airplane" },
	{ id: 6, class: "bus" },
	{ id: 7, class: "train" },
	{ id: 8, class: "truck" },
	{ id: 9, class: "boat" },
	{ id: 10, class: "traffic light" },
	{ id: 11, class: "fire hydrant" },
	{ id: 13, class: "stop sign" },
	{ id: 14, class: "parking meter" },
	{ id: 15, class: "bench" },
	{ id: 16, class: "bird" },
	{ id: 17, class: "cat" },
	{ id: 18, class: "dog" },
	{ id: 19, class: "horse" },
	{ id: 20, class: "sheep" },
	{ id: 21, class: "cow" },
	{ id: 22, class: "elephant" },
	{ id: 23, class: "bear" },
	{ id: 24, class: "zebra" },
	{ id: 25, class: "giraffe" },
	{ id: 27, class: "backpack" },
	{ id: 28, class: "umbrella" },
	{ id: 31, class: "handbag" },
	{ id: 32, class: "tie" },
	{ id: 33, class: "suitcase" },
	{ id: 34, class: "frisbee" },
	{ id: 35, class: "skis" },
	{ id: 36, class: "snowboard" },
	{ id: 37, class: "sports ball" },
	{ id: 38, class: "kite" },
	{ id: 39, class: "baseball bat" },
	{ id: 40, class: "baseball glove" },
	{ id: 41, class: "skateboard" },
	{ id: 42, class: "surfboard" },
	{ id: 43, class: "tennis racket" },
	{ id: 44, class: "bottle" },
	{ id: 46, class: "wine glass" },
	{ id: 47, class: "cup" },
	{ id: 48, class: "fork" },
	{ id: 49, class: "knife" },
	{ id: 50, class: "spoon" },
	{ id: 51, class: "bowl" },
	{ id: 52, class: "banana" },
	{ id: 53, class: "apple" },
	{ id: 54, class: "sandwich" },
	{ id: 55, class: "orange" },
	{ id: 56, class: "broccoli" },
	{ id: 57, class: "carrot" },
	{ id: 58, class: "hot dog" },
	{ id: 59, class: "pizza" },
	{ id: 60, class: "donut" },
	{ id: 61, class: "cake" },
	{ id: 62, class: "chair" },
	{ id: 63, class: "couch" },
	{ id: 64, class: "potted plant" },
	{ id: 65, class: "bed" },
	{ id: 67, class: "dining table" },
	{ id: 70, class: "toilet" },
	{ id: 72, class: "tv" },
	{ id: 73, class: "laptop" },
	{ id: 74, class: "mouse" },
	{ id: 75, class: "remote" },
	{ id: 76, class: "keyboard" },
	{ id: 77, class: "cell phone" },
	{ id: 78, class: "microwave" },
	{ id: 79, class: "oven" },
	{ id: 80, class: "toaster" },
	{ id: 81, class: "sink" },
	{ id: 82, class: "refrigerator" },
	{ id: 84, class: "book" },
	{ id: 85, class: "clock" },
	{ id: 86, class: "vase" },
	{ id: 87, class: "scissors" },
	{ id: 88, class: "teddy bear" },
	{ id: 89, class: "hair drier" },
	{ id: 90, class: "toothbrush" }
];
