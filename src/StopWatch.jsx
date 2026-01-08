import React, { useState, useEffect, useRef } from "react";

function StopWatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [editing, setEditing] = useState(null);

  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [isRunning]);

  function start() {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
  }

  function stop() {
    setIsRunning(false);
  }

  function reset() {
    clearInterval(intervalIdRef.current);
    setElapsedTime(0);
    setIsRunning(false);
  }

  function formatTime() {
    let days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    let hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    days = String(days).padStart(2, "0");
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    return `${days}:${hours}:${minutes}:${seconds}:${milliseconds}`;
  }

  function getTimeParts() {
    return {
      days: Math.floor(elapsedTime / (1000 * 60 * 60 * 24)),
      hours: Math.floor((elapsedTime / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((elapsedTime / (1000 * 60)) % 60),
      seconds: Math.floor((elapsedTime / 1000) % 60),
      milliseconds: Math.floor((elapsedTime % 1000) / 10),
    };
  }

  function updateTime(part, value) {
    const time = getTimeParts();
    time[part] = Number(value);

    const newElapsedTime =
      time.days * 24 * 60 * 60 * 1000 +
      time.hours * 60 * 60 * 1000 +
      time.minutes * 60 * 1000 +
      time.seconds * 1000 +
      time.milliseconds * 10;

    setElapsedTime(newElapsedTime);
    setEditing(null);
  }
  function TimeUnit({ value, unit }) {
    return editing === unit ? (
      <input
        type="number"
        autoFocus
        defaultValue={value}
        maxLength={2} // (not reliable alone, but kept)
        onChange={(e) => {
          if (e.target.value.length > 2) {
            e.target.value = e.target.value.slice(0, 2);
          }
        }}
        onKeyDown={(e) => {
          if (
            e.key !== "Backspace" &&
            e.key !== "Delete" &&
            e.key !== "Enter" &&
            e.target.value.length >= 2
          ) {
            e.preventDefault();
          }

          if (e.key === "Enter") {
            updateTime(unit, e.target.value);
          }
        }}
        onBlur={(e) => updateTime(unit, e.target.value)}
        style={{
          width: "50px",
          textAlign: "center",
          fontSize: "1.1rem",
        }}
      />
    ) : (
      <span
        onClick={() => !isRunning && setEditing(unit)}
        style={{
          cursor: isRunning ? "not-allowed" : "pointer",
          padding: "0 4px",
        }}
        title={isRunning ? "Stop timer to edit" : "Click to edit"}
      >
        {String(value).padStart(2, "0")}
      </span>
    );
  }

  const { days, hours, minutes, seconds, milliseconds } = getTimeParts();

  return (
    <div className="stopwatch">
      <div className="display">
        <TimeUnit value={days} unit="days" /> :
        <TimeUnit value={hours} unit="hours" /> :
        <TimeUnit value={minutes} unit="minutes" /> :
        <TimeUnit value={seconds} unit="seconds" /> :
        <TimeUnit value={milliseconds} unit="milliseconds" />
      </div>
      <div className="controls">
        <button className="start-button" onClick={start}>
          start
        </button>
        <button className="stop-button" onClick={stop}>
          stop
        </button>
        <button className="reset-button" onClick={reset}>
          reset
        </button>
      </div>
    </div>
  );
}
export default StopWatch;
