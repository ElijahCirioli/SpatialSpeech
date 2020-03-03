const speechRate = 1; //0-10 value
const depthCutoff = 6; //the maximum distance an object can be away before it is said to be far

const setupSpeech = () => {
	if (typeof speechSynthesis === "undefined") {
		return;
	}
};

//speak out a given string
const speak = str => {
	const sound = new SpeechSynthesisUtterance(str);

	sound.rate = speechRate;
	sound.voice = speechSynthesis.getVoices().filter(voice => {
		return voice.name === "Google US English";
	})[0];
	window.speechSynthesis.speak(sound);
};

//take a list of objects and speak them out in a sentence
const listObjects = groups => {
	groups.sort((a, b) => {
		return a.depth - b.depth;
	});

	const sixthWidth = rightCanvas.width / 6;

	let output = "";
	if (groups.length > 0) {
		groups.forEach(g => {
			//round depth to nearest 0.5
			let roundedDepth = Math.round(g.depth * 2) / 2;
			if (roundedDepth > depthCutoff) {
				roundedDepth = `more than ${depthCutoff}`;
			}

			//add S if plural
			let className = g.class;
			if (g.size > 1) {
				if (g.class === "person") {
					className = "people";
				} else {
					className += "s";
				}
			}

			//determine which horizontal sixth of screen it falls within
			let direction;
			switch (Math.floor(g.pos.x / sixthWidth)) {
				case 0:
					direction = "towards the left";
					break;
				case 1:
					direction = "slightly left";
					break;
				case 4:
					direction = "slightly right";
					break;
				case 5:
					direction = "towards the right";
					break;
				default:
					direction = "ahead";
					break;
			}

			//create sentence for this group
			output += `${g.size} ${className} ${roundedDepth} meters ${direction}. `;
		});

		speak(output);
	} else {
		speak("No objects detected.");
	}
};

speechSynthesis.onvoiceschanged = setupSpeech;
