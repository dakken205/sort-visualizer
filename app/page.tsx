"use client";

import Link from "next/link";
import { useState } from "react";
import Card from "@/app/_components/Card";
import { Sorters } from "@/app/_services/Sorter";

import styles from "./page.module.css";

export default function Home() {
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<string>("bubble-sort");

  return (
    <div className={styles.globalContainer}>
      <h1 className={styles.title}>Sort Visualizer</h1>
      <div className={styles.algorithmBox}>
        {Object.keys(Sorters).map((algorithm) => (
          <Card
            algorithm={algorithm}
            key={algorithm}
            onClick={() => setSelectedAlgorithm(algorithm)}
            isSelected={selectedAlgorithm === algorithm}
          />
        ))}
      </div>
      <div className={styles.buttonBox}>
        <Link href={selectedAlgorithm.toString()}>
          <button className={styles.startButton}>Visualize!</button>
        </Link>
      </div>
    </div>
  );
}
