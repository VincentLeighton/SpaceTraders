import { useEffect, useState, useRef } from "react";
import "./App.css";
import {
  getAgent,
  getShips,
  dockShip,
  orbitShip,
  scanWaypoints,
  getServerStatus,
  getAccount,
} from "./services/api";
import {
  type Agent,
  type Ship,
  type Nav,
  type ServerStatus,
  type ScanWaypointsResponse,
} from "./types";
import ServerResetTimer from "./ServerResetTimer";
import TerminalScreen, { type TerminalScreenHandle } from "./TerminalScreen";
import DialogBox from "./DialogBox";

function App() {
  const [agentValid, setAgentValid] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [agentData, setAgentData] = useState<Agent>();
  const [ships, setShips] = useState<Ship[]>([]);
  const serverResetDate = useRef<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);

  const [timer, setTimer] = useState(() => {
    const now = new Date();
    return Math.max(
      0,
      Math.floor((serverResetDate.current.getTime() - now.getTime()) / 1000)
    );
  });

  const terminalRef = useRef<TerminalScreenHandle>(null);

  useEffect(() => {
    const isAgentValid = async () => {
      try {
        await getAccount();
        setAgentValid(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log("Agent Invalid:",e.message);
      }
    };
    isAgentValid();
  }, []);

  useEffect(() => {
    async function loadStatus() {
      if (loaded) {
        try {
          const newStatus =
            (await getServerStatus()) as unknown as ServerStatus;
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
    // update to "Use" function - Jim said to check it out
    async function loadAgent() {
      try {
        const newAgent = (await getAgent()) as unknown as Agent;
        setAgentData(newAgent);
        console.log("Agent Data: ", newAgent);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log("LoadAgent Error: ", e.message);
        setDialogOpen(true);
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
    if (loaded && terminalRef.current) {
      terminalRef.current.typeToTerminal("Loading......");
      terminalRef.current.typeToTerminal(
        `Welcome ${agentData?.symbol}, command is yours.`
      );
    }
  }, [loaded, agentData?.symbol]);

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

  const switchDocked = async (ship: Ship, i: number) => {
    let newNav = {} as Nav;
    if (ship.nav.status != "DOCKED") {
      newNav = (await dockShip(ship)) as unknown as Nav;
      terminalRef.current?.typeToTerminal(`${ship.symbol} has docked.`);
    } else {
      newNav = (await orbitShip(ship)) as unknown as Nav;
      terminalRef.current?.typeToTerminal(`${ship.symbol} has undocked.`);
    }
    setShips((curShips) => {
      const newShips = [...curShips];
      newShips[i] = { ...newShips[i], nav: newNav };
      console.log("new ships here:", newShips);
      return newShips;
    });
  };

  const scanForWaypoints = async (ship: Ship) => {
    try {
      const response = (await scanWaypoints(ship)) as ScanWaypointsResponse;
      const newWaypoints = response.data.waypoints;
      console.log("Response: ", response);
      if (newWaypoints.length > 0) {
        terminalRef.current?.typeToTerminal(
          `${newWaypoints.length} waypoints found in system ${newWaypoints[0].systemSymbol}.`
        );
        newWaypoints.forEach((waypoint) => {
          terminalRef.current?.typeToTerminal(
            `Waypoint: ${waypoint.symbol} Type: ${waypoint.type}`
          );
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // handle error here
      if (error.response && error.response.data) {
        // Axios error with server message
        terminalRef.current?.typeToTerminal(
          `Error: ${
            error.response.data.error?.message || error.response.data.message
          }`
        );
      } else {
        // Network or other error
        terminalRef.current?.typeToTerminal(
          `Error: ${error.message || error.toString()}`
        );
      }
    }
  };

  if (!loaded) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className="main">
        <div className="agentInfo">
          <ServerResetTimer timer={timer} />
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
              <button
                onClick={() => {
                  scanForWaypoints(ship);
                }}
              >
                Scan For Waypoints
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => setDialogOpen(true)}
        style={{ marginBottom: "1rem" }}
      >
        Open Dialog
      </button>
      <div className="bottomTextArea">
        <TerminalScreen ref={terminalRef} />
      </div>
      <DialogBox open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <h2>The server has reset. Create a new agent to play.</h2>
        <p>This is a dialog box. You can put any content here.</p>
      </DialogBox>
    </>
  );
}

export default App;
