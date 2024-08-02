import { useEffect, useState, useRef } from "react";
import randomArray from "@/app/_services/RandomArray";
import { AbstractSorter } from "@/app/_services/Sorter";
import {
  SlControlPause,
  SlControlPlay,
  SlControlForward,
  SlControlRewind,
} from "react-icons/sl";

import styles from "./Visualizer.module.css";
import { SortHistory } from "../_types";

enum PlayingState {
  PLAYING,
  PAUSED,
}

interface SorterProps {
  sorter: AbstractSorter;
}

export default function Visualizer({ sorter }: SorterProps) {
  const [step, setStep] = useState(0);
  const [playingState, setPlayingState] = useState(PlayingState.PLAYING);

  const animationIntervalRef = useRef<NodeJS.Timeout>();

  const sortHistoryRef = useRef<SortHistory>([
    {
      data: [],
      highlightedIndices: [],
    },
  ]);

  const next = () => {
    setStep((prev) => Math.min(sortHistoryRef.current.length - 1, prev + 1));
  };

  const prev = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    const initialArray = randomArray(30);
    sortHistoryRef.current = sorter.sort(initialArray);
  }, [sorter]);

  useEffect(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    animationIntervalRef.current = setInterval(() => {
      if (playingState === PlayingState.PLAYING) {
        next();
      }
    }, 50);
  }, [playingState]);

  useEffect(() => {
    if (step === sortHistoryRef.current.length - 1) {
      setPlayingState(PlayingState.PAUSED);
    }
  }, [step]);

  return (
    <div className={styles.container}>
      <div className={styles.barBox}>
        {sortHistoryRef.current[step].data.map((value, index) => (
          <Bar
            key={index}
            height={value * 5}
            color={
              sortHistoryRef.current[step].highlightedIndices.includes(index)
                ? "red"
                : "blue"
            }
          />
        ))}
      </div>
      <div className={styles.buttonBox}>
        <input
          type="range"
          onChange={(e) => setStep(parseInt(e.target.value))}
          min={0}
          max={sortHistoryRef.current.length - 1}
          value={step}
          className={styles.seekBar}
        />
        <div className={styles.controllerBox}>
          <SlControlRewind
            size="40"
            onClick={prev}
            className={styles.controller}
          />
          <>
            {playingState === PlayingState.PAUSED && (
              <SlControlPlay
                size="40"
                color="green"
                onClick={() => {
                  if (step === sortHistoryRef.current.length - 1) {
                    setStep(0);
                  }
                  setPlayingState(PlayingState.PLAYING);
                }}
                className={styles.controller}
              />
            )}
            {playingState === PlayingState.PLAYING && (
              <SlControlPause
                size="40"
                color="red"
                onClick={() => setPlayingState(PlayingState.PAUSED)}
                className={styles.controller}
              />
            )}
          </>
          <SlControlForward
            size="40"
            onClick={next}
            className={styles.controller}
          />
        </div>
      </div>
    </div>
  );
}

function Bar({ height, color }: { height: number; color: string }) {
  return (
    <div
      style={{
        height: `${height}px`,
        width: "15px",
        backgroundColor: color,
        margin: "0 2px",
      }}
    ></div>
  );
}
