import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { DivScrollbar } from "./div-scrollbar/div-scrollbar";
import type { UserStyleConfig } from "./div-scrollbar";

export const EXAMPLES = {
  // here is default style option
  // default: {
  //   quickStyle: {
  //     offset: "24px",
  //     padding: "0",
  //     paddingHover: "6px",
  //     minimumSizePx: 20,
  //     transition: {
  //       duration: "0.15s",
  //       timingFunction: "ease",
  //       properties: ["backgroundColor", "padding", "width", "height"],
  //     },

  //     borderRadius: "9999px",

  //     thickness: {
  //       thumb: "6px",
  //       thumbHover: "6px",
  //       track: "6px",
  //       trackHover: "6px",
  //     },

  //     color: {
  //       thumb: "#00000044",
  //       thumbHover: "#00000066",
  //       track: "#00000010",
  //       trackHover: "#00000010",
  //     },
  //   },

  //   advancedStyle: {
  //     thumb: { position: "absolute", display: "flex" },
  //     thumbHover: {},
  //     track: { position: "absolute" },
  //     trackHover: {},
  //   },
  // },

  // every style options are Partial
  // custom option merges default options
  bigOne: {
    quickStyle: {
      thickness: {
        thumb: "12px",
        track: "12px",
        thumbHover: "16px",
        trackHover: "16px",
      },
      padding: "2px",
      paddingHover: "12px",
    },
  },

  // use thickness option instead of width/height option
  // advancedStyles are merged lastly
  usingAdvancedStyle: {
    quickStyle: {
      thickness: {
        thumb: "12px",
        thumbHover: "12px",
        track: "12px",
        trackHover: "12px",
      },
    },
    advancedStyle: {
      track: { boxShadow: "2px 2px 4px #00000040" },
      trackHover: { boxShadow: "3px 3px 8px #00000060" },
    },
  },

  thinMinimal: {
    quickStyle: {
      thickness: {
        thumb: "4px",
        track: "4px",
        thumbHover: "6px",
        trackHover: "6px",
      },
      padding: "0px",
      paddingHover: "2px",
      color: {
        thumb: "#00000033",
        thumbHover: "#00000055",
        track: "transparent",
        trackHover: "#00000008",
      },
    },
  },

  softRounded: {
    quickStyle: {
      borderRadius: "8px",
      thickness: {
        thumb: "10px",
        track: "10px",
        thumbHover: "14px",
        trackHover: "14px",
      },
      color: {
        thumb: "#7c9cff66",
        thumbHover: "#7c9cffaa",
        track: "#7c9cff22",
        trackHover: "#7c9cff33",
      },
    },
  },

  darkMode: {
    quickStyle: {
      thickness: {
        thumb: "8px",
        track: "8px",
        thumbHover: "12px",
        trackHover: "12px",
      },
      padding: "2px",
      paddingHover: "6px",
      color: {
        thumb: "#ffffff55",
        thumbHover: "#ffffffaa",
        track: "#ffffff22",
        trackHover: "#ffffff33",
      },
    },
  },

  neonGlow: {
    quickStyle: {
      thickness: {
        thumb: "10px",
        track: "6px",
        thumbHover: "14px",
        trackHover: "6px",
      },
      color: {
        thumb: "#00ffcc",
        thumbHover: "#00ffee",
        track: "transparent",
        trackHover: "transparent",
      },
      paddingHover: "0",
    },
    advancedStyle: {
      thumb: {
        boxShadow: "0 0 4px #00ffcc, 0 0 8px #00ffcc",
      },
      thumbHover: {
        boxShadow: "0 0 8px #00ffee, 0 0 12px #00ffee",
      },

      track: { border: "1px solid #00ffcc80" },
    },
  },

  chunkyBlock: {
    quickStyle: {
      borderRadius: "4px",
      thickness: {
        thumb: "14px",
        track: "14px",
        thumbHover: "18px",
        trackHover: "18px",
      },
      padding: "4px",
      paddingHover: "8px",
      color: {
        thumb: "#ff6b6b",
        thumbHover: "#ff4b4b",
        track: "#ff6b6b22",
        trackHover: "#ff6b6b33",
      },
    },
  },
} satisfies Record<string, UserStyleConfig>;

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
        <DivScrollbar scrollDirection="auto" customStyle={EXAMPLES.bigOne}>
          <div
            style={{
              height: "40rem",
              width: "40rem",
              // backgroundColor: "#000000",
            }}
          >
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
