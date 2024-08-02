import styles from "./Card.module.css";

interface CardProps {
  algorithm: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function Card({ algorithm, isSelected, onClick }: CardProps) {
  return (
    <div
      className={styles.button}
      onClick={onClick}
      style={{ backgroundColor: isSelected ? "#fff" : "" }}
    >
      <h2>{algorithm}</h2>
    </div>
  );
}
