import { useEffect, useState, use, useRef } from "react";
import "./App.css";
import {
  getAgent,
  getShips,
  dockShip,
  orbitShip,
  scanShipWaypoints,
  getServerStatus
} from "./services/api";
import { type Agent, type Ship, type Nav, type ServerStatus } from "./types";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [agentData, setAgentData] = useState<Agent>();
  const [ships, setShips] = useState<Ship[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus>();

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
    async function loadStatus() {
      try {
        const newStatus = (await getServerStatus()) as unknown as ServerStatus;
        setServerStatus(newStatus);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log(e.message);
      }
    }
    loadStatus();
    loadAgent()
      .then(loadShips)
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
  if (loaded) {
    typeToTerminal("Loading......");
    typeToTerminal(`Welcome ${agentData?.symbol}, command is yours.`);
  }
}, [loaded]);

  const switchDocked = async (ship: Ship, i: number) => {
    let newNav = {} as Nav;
    if (ship.nav.status != "DOCKED") {
      newNav = (await dockShip(ship)) as unknown as Nav;
      typeToTerminal(`${ship.symbol} has docked.`)
    } else {
      newNav = (await orbitShip(ship)) as unknown as Nav;
      typeToTerminal(`${ship.symbol} has undocked.`)
    }
    setShips((curShips) => {
      const newShips = [...curShips];
      newShips[i] = { ...newShips[i], nav: newNav };
      console.log("new ships here:", newShips);
      return newShips;
    });
  };

  const terminalQueue = useRef<string[]>([]);
  const typing = useRef(false);

  const typeToTerminal = (text: string, delay: number = 50) => {
    terminalQueue.current.push(text.endsWith("\n") ? text : text + "\n");
    processQueue(delay);
  };

  const processQueue = (delay: number) => {
    if (typing.current) return;
    if (terminalQueue.current.length === 0) return;

    typing.current = true;
    const terminalScreen = document.getElementById("terminalScreen");
    if (!terminalScreen) {
      typing.current = false;
      return;
    }
    const text = terminalQueue.current.shift()!;
    let index = 0;
    function addCharacter() {
      if (index < text.length) {
        terminalScreen!.textContent += text.charAt(index);
        index++;
        terminalScreen!.scrollTop = terminalScreen!.scrollHeight;
        setTimeout(addCharacter, delay);
      } else {
        typing.current = false;
        processQueue(delay); // Process next item in the queue
      }
    }
    addCharacter();
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
        <div id="terminalScreen"></div>
      </div>
    </>
  );
}

export default App;
