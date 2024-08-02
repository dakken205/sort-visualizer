export default function randomArray(n: number) {
  return Array(n)
    .fill(0)
    .map((_, i) => i + 1)
    .toSorted((_, __) => Math.random() - 0.5);
}
