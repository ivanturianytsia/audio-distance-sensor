function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
	if (navigator.mediaDevices) {
		navigator.mediaDevices.getUserMedia(mediaConstraints)
			.then(successCallback)
			.catch(errorCallback);
	} else {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		navigator.getUserMedia(mediaConstraints)
			.then(successCallback)
			.catch(errorCallback);
	}

}
var mediaConstraints = {
	audio: true
};

function startRecording() {
	message.innerHTML = "Recording..."
	captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
};

function stopRecording() {
	mediaRecorder.stop();
	mediaRecorder.stream.stop();

	recordBtn.disabled = false;
};
var mediaRecorder;

function onMediaSuccess(stream) {
	var audio = document.createElement("audio");
	audio = mergeProps(audio, {
		controls: true,
		muted: true,
		src: URL.createObjectURL(stream)
	});
	audio.play();
	audiosContainer.innerHTML = audio;
	mediaRecorder = new MediaStreamRecorder(stream);
	mediaRecorder.stream = stream;
	mediaRecorder.recorderType = StereoAudioRecorder;
	mediaRecorder.mimeType = "audio/wav";
	mediaRecorder.audioChannels = 1;

	var startTime = Date.now()

	mediaRecorder.ondataavailable = function(blob) {
		var socketStream = ss.createStream();
		message.innerHTML = "Done recording. File: " + startTime + ".wav"
		$("record-progress").css("width", "0%");

		ss(socket).emit('done-recording', socketStream, {
			start: startTime
		});

		ss.createBlobReadStream(blob).pipe(socketStream);
	};
	var timeInterval = 5 * 1000



	window.setTimeout(function() {
		stopRecording()
	}, timeInterval)

	startTime = Date.now()
	mediaRecorder.start(timeInterval);
	runProgressBar(timeInterval, startTime)

}

function onMediaError(e) {
	message.innerHTML = "Media error: " + e;
}

var audiosContainer = document.getElementById("audio-container");
var message = document.getElementById("message");
var index = 1;

window.onbeforeunload = function() {
	recordBtn.disabled = false;
};

var socket = io.connect(":8080")
var recordBtn = document.getElementById("record")
recordBtn.onclick = function() {
	socket.emit("start-recording")
}

socket.on("start-recording", function(data) {
	recordBtn.disabled = true;
	startRecording()
})

function runProgressBar(timeInterval, start) {
	$("record-progress").css("width", "0%");
	var finish = start + timeInterval;
	var interval = window.setInterval(function() {
		if (finish > Date.now()) {
			var per = (Date.now() - start) * 100 / timeInterval;
			$("#record-progress").css("width", per + "%");
		} else {
			$("#record-progress").css("width", "100%");
			interval = null;
		}
	}, 1000)
}
