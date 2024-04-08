import data from '../data/models-list.json';

interface ModelItem {
  Model: string;
  Size: string;
  'Word error rate/Speed': string;
  Notes: string;
  License: string;
  URL: string;
}

const TableComponent = () => {

  // Function to handle download
  const handleDownload = (url: string) => {
    console.log("Downloading model from:", url);
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
                  <button
                    className={`text-white font-bold py-2 px-4 rounded ${item.Downloaded ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                    onClick={() => {
                      if (!item.Downloaded) {
                        handleDownload(item.URL);
                      }
                    }}
                    disabled={item.Downloaded}>
                    {item.Downloaded ? 'Downloaded' : 'Download'}
                  </button>
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
