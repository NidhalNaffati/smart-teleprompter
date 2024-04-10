import path from "node:path";
import {app, BrowserWindow} from "electron";
import fs from "fs";
import https from "https";
import AdmZip from "adm-zip";

interface ModelData {
  Model: string;
  URL: string;
  Size: string;
  'Word error rate/Speed': string;
  Notes: string;
  License: string;
  Downloaded: boolean;
}

export function downloadModel(url: string, name: string) {
  const window = BrowserWindow.getFocusedWindow(); // Get the reference to the focused window

  const fileName = path.basename(url); // Extracting the file name from the provided URL
  const downloadDir = path.join(app.getAppPath(), "models"); // Generating the directory path where the file will be downloaded
  const downloadPath = path.join(downloadDir, fileName); // Generating the full path for the downloaded file

  try {
    // Check if the directory exists, if not, create it
    if (!fs.existsSync(downloadDir)) {
      console.log(`Creating directory: ${downloadDir}`)
      fs.mkdirSync(downloadDir, {recursive: true}); // Creating the directory recursively if it doesn't exist
    }

    const file = fs.createWriteStream(downloadPath); // Creating a writable stream to write the downloaded data into a file

    const request = https.get(url, response => { // Making a GET request to the provided URL
      if (response.statusCode === 200) { // Checking if the response status code is successful
        let downloadedBytes = 0; // Variable to track the downloaded bytes
        let totalBytes: number | undefined = undefined; // Variable to store the total bytes of the response, if available

        if (response.headers['content-length']) { // Checking if the response contains content length header
          totalBytes = parseInt(response.headers['content-length'], 10); // Parsing the content length to get the total bytes
        }

        response.on('data', chunk => { // Handling data received in chunks
          downloadedBytes += chunk.length; // Updating the downloaded bytes counter
          const progress = totalBytes ? (downloadedBytes / totalBytes) * 100 : 0; // Calculating the download progress percentage
          console.log(`Downloaded ${progress.toFixed(2)}%`); // Logging the download progress
          file.write(chunk); // Writing the received data chunk to the file
        });

        response.on("end", () => { // Handling end of response
          file.end(); // Closing the file stream
          console.log(`Download complete: ${downloadPath}`); // Logging download completion
          if (window) {
            window.webContents.send('download-complete', "Download Complete from the main process"); // Sending a message to the renderer process indicating download completion
          }
          extractFiles(downloadPath, downloadDir); // Extracting the downloaded zip file (assuming it's a zip file
          updateModelDownloadStatus(name, true); // Updating the downloaded status of the model in the models list
        });

      } else {
        file.close(); // Closing the file stream
        fs.unlinkSync(downloadPath); // Deleting the incomplete file
        console.error(`Error downloading file: Status Code ${response.statusCode}`); // Logging the error due to unsuccessful response status code
      }
    });

    request.on("error", err => { // Handling request error
      fs.unlinkSync(downloadPath); // Deleting the file if there's an error during download
      console.error(`Error downloading file: ${err.message}`); // Logging the error message
    });
  } catch (error) {
    console.error(`Error downloading file: ${error}`); // Catching and logging any error occurred during the download process
  }
}

function extractFiles(zipPath: string, extractDir: string) {
  try {
    const zip = new AdmZip(zipPath); // Creating a new instance of AdmZip with the downloaded zip file
    zip.extractAllTo(extractDir, true); // Extracting the contents of the zip file to the provided directory
    console.log(`Extracted files to: ${extractDir}`); // Logging the extraction completion
  } catch (error) {
    console.error(`Error extracting files: ${error}`); // Catching and logging any error occurred during the extraction process
  } finally {
    fs.unlinkSync(zipPath); // Deleting the downloaded zip file after extraction
    console.log(`Deleted zip file: ${zipPath}`); // Logging the deletion of the zip file
  }
}

export function deleteModel(modelName: string): void {
  const modelPath = path.join(app.getAppPath(), 'models', modelName);

  try {
    if (fs.existsSync(modelPath)) { // Checking if the model directory exists
      fs.rmSync(modelPath, {recursive: true}); // Deleting the model directory if it exists
      console.log(`Model ${modelName} deleted successfully.`);
      updateModelDownloadStatus(modelName, false); // updating the downloaded status
    } else {
      console.error(`Model ${modelName} not found.`);
      updateModelDownloadStatus(modelName, false); // update the downloaded status even if the model is not found
    }
  } catch (err) {
    console.error('Error deleting model:', err);
  }
}

function updateDownloadStatus(models: ModelData[], modelName: string, status: boolean): ModelData[] {
  return models.map(model => { // Mapping over the models list
    if (model.Model === modelName) { // Checking if the model name matches the provided model name
      return {
        ...model, // Keeping the existing model data
        Downloaded: status // Updating the downloaded status of the model
      };
    }
    return model;
  });
}

function updateModelDownloadStatus(modelName: string, status: boolean): void {
  const modelList = path.join(app.getAppPath(), 'src', 'data', 'models-list.json');

  fs.readFile(modelList, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    try {
      const models: ModelData[] = JSON.parse(data);
      const updatedModels = updateDownloadStatus(models, modelName, status);
      const updatedData = JSON.stringify(updatedModels, null, 4);

      fs.writeFile(modelList, updatedData, 'utf8', err => {
        if (err) {
          console.error('Error writing to file:', err);
          return;
        }
      });
    } catch (err) {
      console.error('Error parsing JSON:', err);
    }
  });
}
