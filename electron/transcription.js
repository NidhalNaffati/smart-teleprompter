// Import the required modules
import vosk from "vosk";
import mic from "mic";
import fs from "fs";
import process from "process";

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
vosk.setLogLevel(0);

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
micInputStream.on("data", (data) => {
  if (rec.acceptWaveform(data)) {
    const result = rec.result();
    const partialResult = rec.partialResult();
    if (result) {
      console.log("Transcription:", result);
      // Send the result to the main process (Electron's main process)
      process.send({ type: "transcription", data: result });
    } else if (partialResult) {
      process.send({ type: "transcription", data: partialResult });
    }
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