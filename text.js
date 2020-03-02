//the minimum confidence score for text to be read [0, 100]
const textThreshold = 60;

//find all text in an image and read it aloud
const findText = async canvas => {
	//run tessract.js on a canvas
	Tesseract.recognize(canvas, "eng").then(result => {
		let output = "";
		//iterate through each line of text detected
		result.lines.forEach(l => {
			//determine if the neural network is confident enough
			if (l.confidence > textThreshold) {
				output += l.text + " ";
			}
		});

		//if no text was found with enough confidence
		if (output.length === 0) {
			output = "No text detected.";
		}

		//speak the text aloud
		speak(output);
	});
};
