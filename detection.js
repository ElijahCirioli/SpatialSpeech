let ml;

//load the tensorflow js model from the CDN
const setupModel = () => {
	cocoSsd
		.load()
		.then(model => {
			ml = model;
			processing = false;
			speak("Model loaded.");
		})
		.catch(error => {
			speak("Failed to load model.");
		});
};

//return a list of objects given an image
const analyze = async canvas => {
	return ml
		.detect(canvas)
		.then(predictions => {
			return predictions;
		})
		.catch(error => {
			alert(error);
		});
};
