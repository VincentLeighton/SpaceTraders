import { useEffect, useState, useMemo, useRef } from "react";
import "./App.css";
import {
  getAgent,
  getShips,
  dockShip,
  orbitShip,
  scanShipWaypoints,
  getServerStatus,
} from "./services/api";
import { type Agent, type Ship, type Nav, type ServerStatus } from "./types";

function App() {
  const [loaded, setLoaded] = useState(false);
  const [agentData, setAgentData] = useState<Agent>();
  const [ships, setShips] = useState<Ship[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus>();
  const serverResetDate = useRef<Date>(new Date());

  const [timer, setTimer] = useState(() => {
    const now = new Date();
    return Math.max(
      0,
      Math.floor((serverResetDate.current.getTime() - now.getTime()) / 1000)
    );
  });

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

  useEffect(() => {
    async function loadStatus() {
      if (loaded) {
        try {
          const newStatus =
            (await getServerStatus()) as unknown as ServerStatus;
          setServerStatus(newStatus);
          if (newStatus) {
            serverResetDate.current = new Date(newStatus.serverResets.next);
            // console.log("Next reset:", newStatus.serverResets.next);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          console.log(e.message);
        }
      }
    }
    loadStatus();
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      typeToTerminal("Loading......");
      typeToTerminal(`Welcome ${agentData?.symbol}, command is yours.`);
    }
  }, [loaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const secondsLeft = Math.max(
        0,
        Math.floor((serverResetDate.current.getTime() - now.getTime()) / 1000)
      );
      setTimer(secondsLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, serverResetDate]);

  function formatTime(seconds: number) {
  const d = Math.floor(seconds / 86400)
  .toString()
    .padStart(2, "0");
  const h = Math.floor((seconds / 3600) / 12)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${d}:${h}:${m}:${s} `;
}

  const switchDocked = async (ship: Ship, i: number) => {
    let newNav = {} as Nav;
    if (ship.nav.status != "DOCKED") {
      newNav = (await dockShip(ship)) as unknown as Nav;
      typeToTerminal(`${ship.symbol} has docked.`);
    } else {
      newNav = (await orbitShip(ship)) as unknown as Nav;
      typeToTerminal(`${ship.symbol} has undocked.`);
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
          <p>Server Reset: {timer > 0 ? formatTime(timer) : "Time's up!"}</p>
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
