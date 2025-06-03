import { useEffect, useState, use } from "react";
import "./App.css";
import {
  getAgent,
  getShips,
  dockShip,
  orbitShip,
  scanShipWaypoints,
} from "./services/api";
import { type Agent, type Ship, type Nav } from "./types";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [agentData, setAgentData] = useState<Agent>();
  const [ships, setShips] = useState<Ship[]>([]);
  let terminalScreen: HTMLElement | null = null;

  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ac metus et turpis maximus fringilla. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut nec gravida metus, a pulvinar dui. Donec lobortis accumsan enim eget finibus.'
  useEffect(() => {
    // update to "Use" function - Jim said to check it out
    async function loadAgent() {
      try {
        const newAgent = (await getAgent()) as unknown as Agent;
        setAgentData(newAgent);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log(e.message);
      }
    }
    async function loadShips() {
      try {
        const newShips = (await getShips()) as unknown as Ship[];
        setShips(newShips);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log(e.message);
      }
    }
    loadAgent()
      .then(loadShips)
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  const switchDocked = async (ship: Ship, i: number) => {
    let newNav = {} as Nav;
    if (ship.nav.status != "DOCKED") {
      newNav = (await dockShip(ship)) as unknown as Nav;
    } else {
      newNav = (await orbitShip(ship)) as unknown as Nav;
    }
    setShips((curShips) => {
      const newShips = [...curShips];
      newShips[i] = { ...newShips[i], nav: newNav };
      console.log("new ships here:", newShips);
      return newShips;
    });
  };

  const typeText = (element: HTMLElement, text: string, delay: number) => {
    let index = 0;
    function addCharacter() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        element.scrollTop = element.scrollHeight;
        setTimeout(addCharacter, delay);
      }
    }
    addCharacter();
  };

  const addText = (text: string) => {
    console.log('outside', terminalScreen);
    terminalScreen = document.getElementById("terminalScreen");
    if (terminalScreen) {
      console.log("in if terminal screen:", text);
      
      const textToDisplay = `${text}\n`;
      typeText(terminalScreen, textToDisplay, 25); // 50ms delay per character
    }
  };

  if (!loaded) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className="main">
        <div className="agentInfo">
          <p>Agent: {agentData != undefined ? agentData.symbol : "no agent"}</p>
          <p>
            Credits: {agentData != undefined ? agentData.credits : "no agent"}
          </p>
          <p>
            Ship Count:{" "}
            {agentData != undefined ? agentData.shipCount : "no agent"}
          </p>
          <p>
            Faction:{" "}
            {agentData != undefined ? agentData.startingFaction : "no agent"}
          </p>
        </div>

        <div className="shipInfo">
          <p>Ships:</p>
          {/* <pre>{JSON.stringify(ships, null, 2)}</pre> */}
          {ships?.map((ship, i) => (
            <div key={ship.symbol}>
              <p>{ship.symbol}</p>
              <button
                onClick={() => {
                  switchDocked(ship, i);
                }}
              >
                {ship.nav.status === "IN_ORBIT"
                  ? "Dock"
                  : ship.nav.status === "DOCKED"
                  ? "Undock"
                  : ship.nav.status}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="bottomTextArea">
        <button
          onClick={() => {
            addText(lorem);
          }}
        >
          Add Text
        </button>
        <div id="terminalScreen"></div>
      </div>
    </>
  );
}

export default App;
