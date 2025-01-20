"use client";

import { useState } from "react";

interface TimerButtonProps {
  projectId: string;
}

const TimerButton: React.FC<TimerButtonProps> = ({ projectId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const handleToggle = async () => {
    if (isRunning) {
      const endTime = new Date();
      await fetch(`/api/timer`, {
        method: "POST",
        body: JSON.stringify({ projectId, startTime, endTime }),
      });
      setStartTime(null);
    } else {
      setStartTime(new Date());
    }
    setIsRunning(!isRunning);
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-4 py-2 ${isRunning ? "bg-red-500" : "bg-green-500"} text-white`}
    >
      {isRunning ? "停止" : "開始"}
    </button>
  );
};

export default TimerButton;
