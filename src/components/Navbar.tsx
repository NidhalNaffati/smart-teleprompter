import '../styles/navbar.css';
import {Link} from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/settings" className="nav-link">Settings</Link>
        </li>
        <li className="nav-item">
          <Link to="/transcription" className="nav-link">Transcription</Link>
        </li>
      </ul>
    </nav>
  );
}
