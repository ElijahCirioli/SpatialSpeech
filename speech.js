const speechRate = 0.9; //0-10 value

const setupSpeech = () => {
	if (typeof speechSynthesis === "undefined") {
		return;
	}
};

const speak = str => {
	const sound = new SpeechSynthesisUtterance(str);

	sound.rate = speechRate;
	sound.voice = speechSynthesis.getVoices().filter(voice => {
		return voice.name === "Google US English";
	})[0];
	window.speechSynthesis.speak(sound);
};

const listObjects = groups => {
	const fifthWidth = rightCanvas.width / 5;

	let output = "";
	if (groups.length > 0) {
		groups.forEach(g => {
			const roundedDepth = Math.round(g.depth * 2) / 2;

			let plural = "";
			if (g.size > 1) {
				plural = "s";
			}

			let direction;
			switch (Math.floor(g.pos.x / fifthWidth)) {
				case 0:
					direction = "towards the left";
					break;
				case 1:
					direction = "slightly left";
					break;
				case 3:
					direction = "slightly right";
					break;
				case 4:
					direction = "towards the right";
					break;
				default:
					direction = "directly ahead";
					break;
			}

			output += `${g.size} ${g.class + plural} ${roundedDepth} meters ${direction}. `;
		});

		speak(output);
	} else {
		speak("No objects detected.");
	}
};

speechSynthesis.onvoiceschanged = setupSpeech;
