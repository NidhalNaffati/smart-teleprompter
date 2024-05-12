// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const vosk = require("vosk");
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const mic = require("mic");
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const process = require("node:process");

// Define the sample rate of the microphone
const SAMPLE_RATE = 16000;

// Retrieve modelPath from command-line arguments
const MODEL_PATH = process.argv[2]; // Assuming MODEL_PATH is the first argument

function stopVosk(voskObjects) {
  voskObjects.micInstance.stop();
  voskObjects.rec.free();
  voskObjects.model.free();
}

// Main functions
function startVosk() {

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
    process.send({error: error});
  }

  // Create a Vosk recognizer
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
    process.send({error: error});
  }

}

// Start the Vosk recognizer
startVosk();