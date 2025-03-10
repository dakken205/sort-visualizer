import Link from "next/link";
import Visualizer from "@/app/_components/Visualizer";
import { Sorters } from "@/app/_services/Sorter";

import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const algorithmIdentifier = params.slug;

  if (!algorithmIdentifier || !Sorters[algorithmIdentifier]) {
    return <div>Invalid algorithm</div>;
  }

  return (
    <div className={styles.globalContainer}>
      <div className={styles.buttonContainer}>
        <Link href="/">
          <button className={styles.backButton}>Back</button>
        </Link>
      </div>
      <Visualizer algorithmIdentifier={algorithmIdentifier} />
    </div>
  );
}

export function generateStaticParams() {
  return [
    ...Object.keys(Sorters).map((algorithm) => ({
      slug: algorithm,
    })),
  ];
}
