import { useEffect, useState } from "react";
import "./App.css";
import axios, { AxiosHeaders } from "axios";

const accountToken = import.meta.env.VITE_REACT_APP_ACCOUNT_TOKEN;
const agentToken = import.meta.env.VITE_REACT_APP_AGENT_TOKEN;

type agent = {
  accountId: string;
  credits: number;
  headquarters: string;
  shipCount: number;
  startingFaction: string;
  symbol: string;
};

type Ship = {
  symbol: "string";
  registration: {
    name: "string";
    factionSymbol: "string";
    role: "FABRICATOR";
  };
  nav: {
    systemSymbol: "string";
    waypointSymbol: "string";
    route: {
      destination: {
        symbol: "string";
        type: "PLANET";
        systemSymbol: "string";
        x: 1;
        y: 1;
      };
      origin: {
        symbol: "string";
        type: "PLANET";
        systemSymbol: "string";
        x: 1;
        y: 1;
      };
      departureTime: "2025-06-02T01:18:46.881Z";
      arrival: "2025-06-02T01:18:46.881Z";
    };
    status: "IN_TRANSIT";
    flightMode: "CRUISE";
  };
  crew: {
    current: 1;
    required: 1;
    capacity: 1;
    rotation: "STRICT";
    morale: 1;
    wages: 1;
  };
  frame: {
    symbol: "FRAME_PROBE";
    name: "string";
    condition: 1;
    integrity: 1;
    description: "string";
    moduleSlots: 1;
    mountingPoints: 1;
    fuelCapacity: 1;
    requirements: {
      power: 1;
      crew: 1;
      slots: 1;
    };
    quality: 1;
  };
  reactor: {
    symbol: "REACTOR_SOLAR_I";
    name: "string";
    condition: 1;
    integrity: 1;
    description: "string";
    powerOutput: 1;
    requirements: {
      power: 1;
      crew: 1;
      slots: 1;
    };
    quality: 1;
  };
  engine: {
    symbol: "ENGINE_IMPULSE_DRIVE_I";
    name: "string";
    condition: 1;
    integrity: 1;
    description: "string";
    speed: 1;
    requirements: {
      power: 1;
      crew: 1;
      slots: 1;
    };
    quality: 1;
  };
  modules: [
    {
      symbol: "MODULE_MINERAL_PROCESSOR_I";
      name: "string";
      description: "string";
      capacity: 1;
      range: 1;
      requirements: {
        power: 1;
        crew: 1;
        slots: 1;
      };
    }
  ];
  mounts: [
    {
      symbol: "MOUNT_GAS_SIPHON_I";
      name: "string";
      description: "string";
      strength: 1;
      deposits: ["QUARTZ_SAND"];
      requirements: {
        power: 1;
        crew: 1;
        slots: 1;
      };
    }
  ];
  cargo: {
    capacity: 1;
    units: 1;
    inventory: [
      {
        symbol: "PRECIOUS_STONES";
        name: "string";
        description: "string";
        units: 1;
      }
    ];
  };
  fuel: {
    current: 1;
    capacity: 1;
    consumed: {
      amount: 1;
      timestamp: "2025-06-02T01:18:46.881Z";
    };
  };
  cooldown: {
    shipSymbol: "string";
    totalSeconds: 1;
    remainingSeconds: 1;
    expiration: "2025-06-02T01:18:46.881Z";
  };
};

function App() {
  const [loaded, setLoaded] = useState(false);
  const [agentData, setAgentData] = useState<agent>();
  const [ships, setShips] = useState<Ship[]>();
  const baseUrl = "https://api.spacetraders.io/v2/";
  const headers = new AxiosHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${agentToken}`,
  });

  useEffect(() => {
    getAgent().then(getShips);
  }, []);

  // const switchDocked = (s: Ship)=>{
  //   if(s.nav.status != 'DOCKED'){
  //     dockShip()
  //   }
  //   else{
  //     orbitShip()
  //   }
  // }

  const getAgent = async () => {
    axios
      .get(`${baseUrl}my/agent`, { headers })
      .then((response) => {
        console.log("Agent Data:", response.data.data);
        const newAgent = response.data.data;
        setAgentData({
          accountId: newAgent.accountId,
          credits: newAgent.credits,
          headquarters: newAgent.credits,
          shipCount: newAgent.shipCount,
          startingFaction: newAgent.startingFaction,
          symbol: newAgent.symbol,
        });
        console.log("-----", newAgent?.symbol);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getShips = async () => {
    axios
      .get(`${baseUrl}my/ships`, { headers })
      .then((response) => {
        console.log("Ships Data:", response.data.data);
        const newShips = response.data.data;
        setShips(
          newShips.map((ship: Ship) => ({
            ...ship,
            symbol: ship.symbol,
          }))
        );
        setLoaded(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const scanShipWaypoints = async () => {
    axios
      .post(`${baseUrl}my/ships/ZORVEN-1/scan/waypoints`, undefined, {
        headers,
      })
      .then((response) => {
        console.log("Scan Waypoints Response:", response.data);
        setAgentData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const orbitShip = async () => {
    axios
      .post(`${baseUrl}my/ships/ZORVEN-1/orbit`, undefined, {
        headers,
      })
      .then((response) => {
        console.log("Orbit Ship:", response.data);
        setAgentData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const dockShip = async () => {
    axios
      .post(`${baseUrl}my/ships/ZORVEN-1/dock`, undefined, {
        headers,
      })
      .then((response) => {
        console.log("Dock Ship:", response.data);
        setAgentData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!loaded) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <p>Agent: {agentData != undefined ? agentData.symbol : "no agent"}</p>
      <p>Credits: {agentData != undefined ? agentData.credits : "no agent"}</p>
      <p>Ship Count: {agentData != undefined ? agentData.shipCount : "no agent"}</p>
      <p>Faction: {agentData != undefined ? agentData.startingFaction : "no agent"}</p>
      
      <div>
        <p>Ships:</p>
        {ships?.map((ship) => (
          <div>
            <p key={ship.symbol}>
              {ship.symbol}
            </p>
          {/* <button onClick={()=>{switchDocked(ship)}}>{ship.nav.status}</button> */}
          </div>
          ))}
      </div>
    </>
  );
}

export default App;
