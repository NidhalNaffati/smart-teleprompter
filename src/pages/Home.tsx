import {Link} from 'react-router-dom';

function HomePage() {
  return (
    <div className="container pt-16 px-4 sm:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col justify-center items-start text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Welcome to Transcription App</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Transcribe your audio files accurately and efficiently with our cutting-edge transcription models.
          </p>
          <Link
            to="/transcription"
            className="mt-8 px-6 py-3 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
        <div className="flex justify-center">
          <img
            src="/src/assets/logo.jpeg"
            alt="Transcription App"
            className="w-full h-auto max-w-md"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
