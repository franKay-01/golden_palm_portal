import { useState, useEffect } from "react";

export const InactivityDetector = ({ onInactive }) => {
  const [timer, setTimer] = useState(null);

  const handleActivity = () => {
    clearTimeout(timer);
    setTimer(setTimeout(onInactive, 10 * 60 * 1000));
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keydown", handleActivity);

    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keydown", handleActivity);
    };
  }, []);

  return null;
};
