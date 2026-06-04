export class SeededRandom {
  private seed: number;

  constructor(seedString: string) {
    let h = 0;
    for (let i = 0; i < seedString.length; i++) {
      h = Math.imul(31, h) + seedString.charCodeAt(i) | 0;
    }
    // Avoid seed of 0
    this.seed = h === 0 ? 1 : h;
  }

  // Returns a deterministic random float [0, 1)
  next(): number {
    this.seed = (Math.imul(1664525, this.seed) + 1013904223) | 0;
    return (this.seed >>> 0) / 4294967296;
  }

  // Returns a float between min and max
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}
