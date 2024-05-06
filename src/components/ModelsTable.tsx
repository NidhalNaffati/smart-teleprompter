import {useState, useEffect} from 'react';
import data from '../data/models-list.json';
import {IpcRenderer} from "electron";
import {ModelItem} from "../types/ModelItem.ts";

const ipcRenderer: IpcRenderer = window.ipcRenderer;

const TableComponent = () => {
  const [, setDownloadProgress] = useState<number>(0);
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  useEffect(() => {
    ipcRenderer.on('download-progress', (_event, progress: number) => {
      setDownloadProgress(prevProgress => {
        console.log('Download progress:', prevProgress); // Log the previous progress
        // TODO: Notify the user about the download progress via Notification
        return progress; // Return the updated progress
      });
    });

    ipcRenderer.on('download-complete', (_event, downloadPath) => {
      console.log('Download complete:', downloadPath);
      alert('Download complete') // TODO: Notify the user about the download completion via Notification
      setDownloadStatus(`Download complete: ${downloadPath}`);
    });

    ipcRenderer.on('download-error', (_event, errorMessage) => {
      setDownloadStatus(`${errorMessage}`);
      console.log(downloadStatus);
      alert(`${errorMessage}`) // TODO: Notify the user about the download error via Notification
    });

    return () => {
      ipcRenderer.removeAllListeners('download-progress');
      ipcRenderer.removeAllListeners('download-complete');
      ipcRenderer.removeAllListeners('download-error');

    };
  }, [downloadStatus]);

  const handleDownload = (modelUrl: string, modelName: string) => {
    try {
      ipcRenderer.send('download-model', modelUrl, modelName);
    } catch (error) {
      console.error('Error downloading or extracting model:', error);
    }
  };

  const handleDelete = (modelName: string) => {
    try {
      ipcRenderer.send('delete-model', modelName);
    } catch (error) {
      console.error('Error deleting model:', error);
    }
  };

  // Function to determine if download button should be rendered
  const areWeRenderingTheModelLanguage = (item: ModelItem): boolean => {
    return item.Size === "" && item['Word error rate/Speed'] === "" && item.Notes === "" && item.License === "";
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead className="bg-gray-800 text-white">
        <tr>
          <th className="px-4 py-2">Model</th>
          <th className="px-4 py-2">Size</th>
          <th className="px-4 py-2">Word error rate/Speed</th>
          <th className="px-4 py-2">Notes</th>
          <th className="px-4 py-2">License</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
        </thead>
        <tbody className="text-center">
        {data.map((item, index) => (
          <tr key={index}
              className={areWeRenderingTheModelLanguage(item) ? "font-bold" : (index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600')}>
            <td className="border px-4 py-2">{item.Model}</td>
            <td className="border px-4 py-2">{item.Size}</td>
            <td className="border px-4 py-2">{item['Word error rate/Speed']}</td>
            <td className="border px-4 py-2">{item.Notes}</td>
            <td className="border px-4 py-2">{item.License}</td>
            {areWeRenderingTheModelLanguage(item) ?
              (
                <td className="border px-4 py-2"></td>
              )
              :
              (
                <td className="border px-4 py-2">
                  {item.Downloaded ?
                    <button
                      className="text-white font-bold py-2 px-4 rounded bg-red-500 hover:bg-red-700"
                      onClick={() => handleDelete(item.Model)}>
                      Delete
                    </button>
                    :
                    <button
                      className="text-white font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700"
                      onClick={() => handleDownload(item.URL, item.Model)}>
                      Download
                    </button>
                  }
                </td>
              )
            }
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
