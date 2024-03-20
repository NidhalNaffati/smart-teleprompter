import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home.tsx";
import Settings from "../pages/Settings.tsx";
import Transcription from "../pages/Transcription.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" Component={Home}/>
        <Route path="/Settings" Component={Settings}/>
        <Route path="/Transcription" Component={Transcription}/>
      </Routes>
    </>
  );
}

export default App;
