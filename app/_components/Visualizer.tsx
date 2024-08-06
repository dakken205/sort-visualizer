"use client";

import { useEffect, useState, useRef } from "react";
import randomArray from "@/app/_services/RandomArray";
import { Sorters } from "@/app/_services/Sorter";
import {
  SlControlPause,
  SlControlPlay,
  SlControlForward,
  SlControlRewind,
} from "react-icons/sl";

import { SortHistory } from "@/app/_types";

import styles from "./Visualizer.module.css";

enum PlayingState {
  PLAYING,
  PAUSED,
}

enum PlayingSpeed {
  SLOW = 0.5,
  NORMAL = 1,
  FAST = 2,
  VERY_FAST = 4,
}

interface SorterProps {
  algorithmIdentifier: string;
}

export default function Visualizer({ algorithmIdentifier }: SorterProps) {
  const [step, setStep] = useState(0);
  const [playingSpeed, setPlayingSpeed] = useState(PlayingSpeed.NORMAL);
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
    const sorter = new Sorters[algorithmIdentifier]();
    const initialArray = randomArray(50);
    sortHistoryRef.current = sorter.sort(initialArray);
  }, [algorithmIdentifier]);

  useEffect(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    animationIntervalRef.current = setInterval(() => {
      if (playingState === PlayingState.PLAYING) {
        next();
      }
    }, 50 / playingSpeed);
  }, [playingState, playingSpeed]);

  useEffect(() => {
    if (step === sortHistoryRef.current.length - 1) {
      setPlayingState(PlayingState.PAUSED);
    }
  }, [step]);

  return (
    <div className={styles.container}>
      <div className={styles.barBox}>
        {sortHistoryRef.current[step].data.map((value, index) => (
          <div
            key={index}
            className={styles.bar}
            style={{
              height: `${value * 5}px`,
              backgroundColor: `${
                sortHistoryRef.current[step].highlightedIndices.includes(index)
                  ? "red"
                  : "blue"
              }`,
            }}
          ></div>
        ))}
      </div>
      <div className={styles.buttonBox}>
        <div className={styles.seekBox}>
          <input
            type="range"
            onChange={(e) => setStep(parseInt(e.target.value))}
            min={0}
            max={sortHistoryRef.current.length - 1}
            value={step}
            className={styles.seekBar}
          />
          <button
            className={styles.speedButton}
            onClick={() => {
              setPlayingSpeed((prev) => {
                switch (prev) {
                  case PlayingSpeed.SLOW:
                    return PlayingSpeed.NORMAL;
                  case PlayingSpeed.NORMAL:
                    return PlayingSpeed.FAST;
                  case PlayingSpeed.FAST:
                    return PlayingSpeed.VERY_FAST;
                  case PlayingSpeed.VERY_FAST:
                    return PlayingSpeed.SLOW;
                }
              });
            }}
          >
            {"×"}
            {playingSpeed}
          </button>
        </div>
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
