import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { DivScrollbar } from "./div-scrollbar/div-scrollbar";

function App() {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div
        style={{
          border: "1px solid",
          height: "20rem",
          width: "20rem",
          position: "relative",
        }}
        ref={ref}
      >
        <DivScrollbar
          scrollDirection="auto"
          customStyle={{
            quickStyle: {
              color: { thumb: "#00000066", thumbHover: "#000000ab" },
              thickness: {
                thumbHover: "6px",
              },
            },
          }}
        >
          <div style={{ height: "40rem", width: "20rem" }}>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
        </DivScrollbar>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
