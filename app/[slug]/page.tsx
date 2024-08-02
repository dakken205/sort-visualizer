"use client";

import Link from "next/link";
import Visualizer from "@/app/_components/Visualizer";
import { Sorters } from "@/app/_services/Sorter";

import styles from "./page.module.css";

interface PageProps {
  params: { slug: string };
}

export default function Page({ params }: PageProps) {
  const AlgorithmIdentifier = params.slug;

  if (!AlgorithmIdentifier || !Sorters[AlgorithmIdentifier]) {
    return <div>Invalid algorithm</div>;
  }
  const sorter = new Sorters[AlgorithmIdentifier]();

  return (
    <div className={styles.globalContainer}>
      <div className={styles.buttonContainer}>
        <Link href="/">
          <button className={styles.backButton}>Back</button>
        </Link>
      </div>
      <Visualizer sorter={sorter} />
    </div>
  );
}
