import { useState, useEffect } from "react";
import { SubHeader } from "./SubHeader";
import Tooltip from "./Tooltip";

interface Props {
  description?: string;
  targetHoursInFuture: number;
}

const CountdownTimer: React.FC<Props> = ({ description, targetHoursInFuture }) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const getSecondsToTargetHour = () => {
      const now = new Date();
      const secondsToHourTarget =
        3600 * targetHoursInFuture - (now.getMinutes() * 60 + now.getSeconds());
      return secondsToHourTarget;
    };

    setRemainingTime(getSecondsToTargetHour());

    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (!(prevTime < 0)) {
          return prevTime - 1;
        }
        return -1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetHoursInFuture]);

  const fmtTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <Tooltip text={description}>
      <SubHeader style={{ fontFamily: "monospace" }}>{fmtTime(remainingTime)}</SubHeader>
    </Tooltip>
  );
};

export default CountdownTimer;
