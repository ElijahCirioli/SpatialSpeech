let ml;

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
