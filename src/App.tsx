import "./styles/App.css";
import {Navbar} from "./components/Navbar.tsx";
import AppRoutes from "./route/AppRoutes.tsx";
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
          <Navbar/>
          <AppRoutes/>
      </BrowserRouter>
    </>
  );
}

export default App;
