import axios, { AxiosHeaders } from "axios";
import { type Agent, type Ship, type Nav, type ServerStatus } from "../types";

const agentToken = import.meta.env.VITE_REACT_APP_AGENT_TOKEN;

const baseUrl = "https://api.spacetraders.io/v2/";
const headers = new AxiosHeaders({
  "Content-Type": "application/json",
  Authorization: `Bearer ${agentToken}`,
});

export const getServerStatus = async (): Promise<ServerStatus> => {
  try {
    const response = await axios.get(baseUrl, { headers });
    // console.log("Server Status:", response.data);
    return response.data as ServerStatus;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAgent = async (): Promise<Agent> => {
  const response = await axios.get(`${baseUrl}my/agent`, { headers });
  return response.data.data as Agent;
};

export const getShips = async (): Promise<Ship[]> => {
  const response = await axios.get(`${baseUrl}my/ships`, { headers });
  return response.data.data as Ship[];
};

export const scanWaypoints = async (ship: Ship) => {
  const response = await axios.post(
    `${baseUrl}my/ships/${ship.symbol}/scan/waypoints`,
    undefined,
    { headers }
  );
  return response.data;
};
export const orbitShip = async (ship: Ship): Promise<Nav> => {
  const response = await axios.post(
    `${baseUrl}my/ships/${ship.symbol}/orbit`,
    undefined,
    { headers }
  );
  return response.data.data.nav;
};
export const dockShip = async (ship: Ship): Promise<Nav> => {
  try {
    const response = await axios.post(
      `${baseUrl}my/ships/${ship.symbol}/dock`,
      undefined,
      { headers }
    );
    // console.log("Dock Ship:", response.data);
    return response.data.data.nav;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
