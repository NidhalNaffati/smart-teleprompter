import {useEffect, useState} from 'react';
import {IpcRenderer} from 'electron';

const ipcRenderer: IpcRenderer = window.ipcRenderer;

const ModelDownload = () => {
  const [downloadStatus, setDownloadStatus] = useState('Not downloaded');
  const modelUrl = 'https://alphacephei.com/vosk/models/vosk-model-spk-0.4.zip';

  function downloadAndExtractModel() {
    try {
      setDownloadStatus('Downloading...');
      ipcRenderer.send('download-file', modelUrl);
    } catch (error) {
      console.error('Error downloading or extracting model:', error);
      setDownloadStatus('Error downloading!');
    }
  }

  useEffect(() => {
    ipcRenderer.on('download-complete', (_event, downloadPath) => {
      console.log('Download complete:', downloadPath);
      alert('Download complete')
      setDownloadStatus(`Download complete: ${downloadPath}`);
    });

    return () => {
      ipcRenderer.removeAllListeners('download-complete');
    };
  }, []);

  return (
    <div>
      <button
        onClick={downloadAndExtractModel}
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        Download and Extract Model
      </button>
      <br/>
      <p>Download Status: {downloadStatus}</p>
    </div>
  );
};

export default ModelDownload;
