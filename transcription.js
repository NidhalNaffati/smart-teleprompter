// Import the required modules
var vosk = require("vosk");
var mic = require("mic");
const fs = require("fs");
const process = require("node:process");

// Define the path to the model
const MODEL_PATH = "model";
// Define the sample rate of the microphone
const SAMPLE_RATE = 16000;

// Check if the model exists
if (!fs.existsSync(MODEL_PATH)) {
  console.error(
    "Please download the model from https://alphacephei.com/vosk/models and unpack as " +
      MODEL_PATH +
      " in the current folder."
  );
  process.exit();
}

// Set the log level to 0 (no logs) for the Vosk library
vosk.setLogLevel(1);

// Load the Vosk model from the specified path
const model = new vosk.Model(MODEL_PATH);

// Create a new Vosk recognizer with the loaded model and sample rate
const rec = new vosk.Recognizer({ model: model, sampleRate: SAMPLE_RATE });

// Create a new instance of the microphone with the specified configuration
var micInstance = mic({
  rate: String(SAMPLE_RATE),
  channels: "1",
  debug: false,
  device: "default",
});

// Get the audio stream from the microphone instance
var micInputStream = micInstance.getAudioStream();

// When new data is available from the microphone stream, feed it to the Vosk recognizer
// Modify the code inside the micInputStream.on("data") event handler to send data to the parent process
// process.stdout.write(rec.result() + "\n");

micInputStream.on("data", (data) => {
  if (rec.acceptWaveform(data)) {
    const recognizedText = rec.result();
    process.send({ recognizedText }); // Send recognized text to the main process via IPC
    console.log(recognizedText);
  } else {
    const partialResult = rec.partialResult();
    process.send({ partialResult }); // Send partial result to the main process via IPC
    console.log(partialResult);
  }
});
// When the microphone stops, stop the recognizer and free the model
micInputStream.on("audioProcessExitComplete", function () {
  console.log("Cleaning up"); // Log a message indicating that the program is cleaning up
  console.log(rec.finalResult()); // Log the final result of the recognizer
  rec.free(); // Free the recognizer
  model.free(); // Free the model
});

// When the microphone stops, stop the recognizer and free the model
process.on("SIGINT", function () {
  console.log("\nStopping"); // Log a message indicating that the program is stopping
  micInstance.stop(); // Stop the microphone
});

// Start the microphone
micInstance.start();
