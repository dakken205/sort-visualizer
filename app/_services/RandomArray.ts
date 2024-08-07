import type { Array } from "@/app/_types";

export default class RandomArray {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(seed?: number) {
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = seed || Math.ceil(Math.random() * 1000000);
  }

  /**
   * Returns a random number between 0 and 1
   */
  random() {
    let t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    return (
      Math.abs((this.w = this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8)))) /
      0x7fffffff
    );
  }

  /**
   * Returns a random array of length n
   */
  generate(n: number): Array {
    return Array(n)
      .fill(0)
      .map((_, i) => i + 1)
      .toSorted((_, __) => this.random() - 0.5);
  }
}
