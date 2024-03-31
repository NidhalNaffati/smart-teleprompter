// Import the required modules
const vosk = require("vosk");
const mic = require("mic");
const fs = require("fs");
const process = require("node:process");

// Define the path to the model
const MODEL_PATH = "model";
// Define the sample rate of the microphone
const SAMPLE_RATE = 16000;

function checkModelExists() {
  if (!fs.existsSync(MODEL_PATH)) { // Check if the model exists
    console.error(
      `Please download the model from https://alphacephei.com/vosk/models and unpack as "${MODEL_PATH}" in the current folder.`
    );
    // Send model exists message to the main process via IPC
    process.send({modelExists: false});
    // Send error message to the main process via IPC
    process.send({error: `Model does not exist in path "${MODEL_PATH}"`});
    process.exit(1);
  }

  // Send model exists message to the main process via IPC
  process.send({modelExists: true});
}

function stopVosk(voskObjects) {
  voskObjects.micInstance.stop();
  voskObjects.rec.free();
  voskObjects.model.free();
}

// Main functions
function startVosk() {

  checkModelExists();

  vosk.setLogLevel(1);

  let model;

  // Create a Vosk model and recognizer
  try {
    model = new vosk.Model(MODEL_PATH);
    // Send loading message to the main process via IPC
    process.send({modelLoaded: true})
  } catch (error) {
    console.error(error);
    // Send model loaded message to the main process via IPC
    process.send({modelLoaded: false});
    process.send({error: error.message});
  }

  const rec = new vosk.Recognizer({model, sampleRate: SAMPLE_RATE});

  // Create and start a microphone instance
  const micInstance = mic({
    rate: String(SAMPLE_RATE),
    channels: "1",
    debug: false,
    device: "default",
  });

  // Get the audio stream from the microphone instance
  const micInputStream = micInstance.getAudioStream();

  // Initialize last recognized prompt
  let lastRecognizedPrompt = "";

  // listen to the data event of the microphone stream
  micInputStream.on("data", (data) => {
    if (rec.acceptWaveform(data)) {
      const recognizedText = rec.result();
      // send the recognized text to the main process via IPC, if the recognizer has recognized the speech, and it's not an empty string
      if (recognizedText && recognizedText.text.length > 0)
        process.send({recognizedText}); // Send recognized text to the main process via IPC
    } else {
      // get the partial result of the recognizer
      const partialResult = rec.partialResult();
      // send the partial result to the main process via IPC, if the recognizer has recognized the speech, and it's not an empty string
      if (partialResult && partialResult.partial.length > 0)
        if (lastRecognizedPrompt !== partialResult.partial) {
          process.send({partialResult}); // Send partial result to the main process via IPC
          lastRecognizedPrompt = partialResult.partial;
        }
    }
  });

  // Handle microphone stop event
  micInputStream.on("audioProcessExitComplete", async () => {
    console.log("Cleaning up...");
    console.log(rec.finalResult());
    await stopVosk({model, rec, micInstance});
  });

  // Handle process interrupt event
  process.on("SIGINT", async () => {
    console.log("\nStopping...");
    await stopVosk({model, rec, micInstance});
    process.exit(0);
  });

  // Start the microphone
  try {
    console.log("Starting...");
    micInstance.start();
    // Send started message to the main process via IPC
    process.send({started: true});
  } catch (error) {
    console.error(error);
    process.send({started: false});
    process.send({error: error.message});
  }

}

// Start the Vosk recognizer
startVosk();