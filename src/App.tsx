import { useState } from 'react'
import './App.css'
import axios, { AxiosHeaders } from "axios";

const accountToken = import.meta.env.VITE_REACT_APP_ACCOUNT_TOKEN;
const agentToken = import.meta.env.VITE_REACT_APP_AGENT_TOKEN;

function App() {
  const [agentData, setAgentData] = useState(0);
  const baseUrl = "https://api.spacetraders.io/v2/";
  const headers = new AxiosHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${agentToken}`,
  });

  const getAgent = async () => {
    axios
      .get(`${baseUrl}my/agent`, { headers })
      .then((response) => {
        console.log("API response:", response.data);
        setAgentData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getShips = async () => {
    axios
      .get(`${baseUrl}my/ships`, { headers })
      .then((response) => {
        console.log("API response:", response.data);
        setAgentData(response.data.data);
        setShips()
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      
    </>
  )
}

export default App
