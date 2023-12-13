import "./styles/App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/electron-vite.animate.svg";
import SpeechToTextAnalyzer from "./components/SpeechToTextAnalyzer.tsx";
import VoskControl from "./components/VoskControl.tsx";

function App() {
  return (
    <>
      <div>
        <div>
          <a href="https://electron-vite.github.io" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo"/>
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo"/>
          </a>
        </div>
      </div>

      <div>
        <VoskControl/>
      </div>

      <div>
        <SpeechToTextAnalyzer/>
      </div>
    </>
  );
}

export default App;
