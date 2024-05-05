import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home.tsx";
import Settings from "../pages/Settings.tsx";
import Transcription from "../pages/Transcription.tsx";
import Models from "../pages/Models.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" Component={Home}/>
        <Route path="/settings" Component={Settings}/>
        <Route path="/transcription" Component={Transcription}/>
        <Route path="/models" Component={Models}/>
      </Routes>
    </>
  );
}

export default App;
