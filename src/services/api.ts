import axios, { AxiosHeaders } from "axios";
import { type Agent, type Ship, type Nav } from "../types";

const agentToken = import.meta.env.VITE_REACT_APP_AGENT_TOKEN;

const baseUrl = "https://api.spacetraders.io/v2/";
const headers = new AxiosHeaders({
  "Content-Type": "application/json",
  Authorization: `Bearer ${agentToken}`,
});

export const getAgent = async (): Promise<Agent> => {
  try {
    const response = await axios.get(`${baseUrl}my/agent`, { headers });
    console.log("Agent Data in API:", response.data.data);
    return response.data.data as Agent;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getShips = async (): Promise<Ship[]> => {
  try {
    const response = await axios.get(`${baseUrl}my/ships`, { headers });
    console.log("Ships Data:", response.data.data);
    return response.data.data as Ship[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const scanShipWaypoints = async () => {
  try {
    const response = await axios.post(
      `${baseUrl}my/ships/ZORVEN-1/scan/waypoints`,
      undefined,
      {
        headers,
      }
    );
    console.log("Scan Waypoints Response:", response.data);
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const orbitShip = async (ship: Ship) : Promise<Nav> => {
  try {
    const response = await axios.post(
      `${baseUrl}my/ships/${ship.symbol}/orbit`,
      undefined,
      { headers }
    );
    console.log("Orbit Ship:", response.data);
    return response.data.data.nav;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const dockShip = async (ship: Ship) : Promise<Nav> => {
  try {
    const response = await axios.post(
      `${baseUrl}my/ships/${ship.symbol}/dock`,
      undefined,
      { headers }
    );
    console.log("Dock Ship:", response.data);
    return response.data.data.nav;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
