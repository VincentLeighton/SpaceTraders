import React from "react";

interface ServerResetTimerProps {
  timer: number;
}

function formatTime(seconds: number) {
  const d = Math.floor(seconds / 86400)
    .toString()
    .padStart(2, "0");
  const h = Math.floor((seconds % 86400) / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${d}:${h}:${m}:${s}`;
}

const ServerResetTimer: React.FC<ServerResetTimerProps> = ({ timer }) => {
  return (
    <p>Server Reset: {timer > 0 ? formatTime(timer) : "Time's up!"}</p>
  );
};

export default ServerResetTimer;
