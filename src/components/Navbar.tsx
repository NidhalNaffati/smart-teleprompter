import {Link} from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-gray-800 py-4">
      <ul className="flex">
        <li className="mr-4">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
        </li>
        <li className="mr-4">
          <Link to="/settings" className="text-white hover:text-gray-300">Settings</Link>
        </li>
        <li className="mr-4">
          <Link to="/transcription" className="text-white hover:text-gray-300">Transcription</Link>
        </li>
      </ul>
    </nav>
  );
}