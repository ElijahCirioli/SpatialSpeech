const leftCanvas = document.getElementById("left-canvas");
const rightCanvas = document.getElementById("right-canvas");
const leftDownload = document.getElementById("left-download");
const rightDownload = document.getElementById("right-download");
const offsetLabel = document.getElementById("delay-label");

let cameras = [];
let leftStream, rightStream;

const setupCameras = () => {
	navigator.mediaDevices
		.enumerateDevices()
		.then(devices => {
			devices.forEach(d => {
				if (d.kind === "videoinput") {
					cameras.push(d.deviceId);
				}
			});
		})
		.catch(err => {
			alert(err);
		});
};

const shutter = async () => {
	let timeOffset;

	const leftImg = await getImage(1);
	shutterSound.play();
	timeOffset = new Date();
	const rightImg = await getImage(0);
	timeOffset = new Date() - timeOffset;
	shutterSound.play();
	offsetLabel.innerHTML = "OFFSET: " + timeOffset + "ms";

	drawCanvas(leftCanvas, leftImg, -1);
	drawCanvas(rightCanvas, rightImg, 1);

	leftDownload.href = leftCanvas.toDataURL("image/jpeg", 1.0);
	rightDownload.href = rightCanvas.toDataURL("image/jpeg", 1.0);
};

const getImage = async index => {
	const constraints = {
		video: { deviceId: { exact: cameras[index] }, facingMode: "environment" },
		audio: false
	};
	return navigator.mediaDevices
		.getUserMedia(constraints)
		.then(stream => {
			const track = stream.getVideoTracks()[0];
			const img = new ImageCapture(track).takePhoto().then(blob => {
				return createImageBitmap(blob).then(bitmap => {
					track.stop();
					return bitmap;
				});
			});
			return img;
		})
		.catch(err => {
			speak(`Camera number ${index} not found.`);
		});
};

const drawCanvas = (canvas, img, scl) => {
	canvas.width = img.width;
	canvas.height = img.height;
	const context = canvas.getContext("2d");
	context.save();
	if (scl < 0) {
		context.translate(canvas.width, canvas.height);
	}
	context.scale(scl, scl);
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(img, 0, 0);
	context.restore();
};
