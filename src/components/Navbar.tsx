import {Link} from 'react-router-dom';

interface NavItemProps {
  to: string;
  label: string;
}

export function Navbar() {
  return (
    <nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
          Home
        </Link>
        <button
          data-collapse-toggle="navbar"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar">
          <ul
            className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <NavItem to="/settings" label="Settings"/>
            <NavItem to="/models" label="Models"/>
            <NavItem to="/transcription" label="Transcription"/>
            <NavItem to="/live" label="Live"/>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function NavItem({to, label}: NavItemProps) {
  return (
    <li>
      <Link
        to={to}
        className="block py-2 px-3 rounded text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition md:p-0 md:dark:text-blue-500"
      >
        {label}
      </Link>
    </li>
  );
}
