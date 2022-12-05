import { readFileSync } from 'fs'

class Range {
  constructor(public start: number, public end: number) {}

  public fullyContains(other: Range): boolean {
    return this.start <= other.start && this.end >= other.end
  }

  public overlaps(other: Range): boolean {
    return (
      (this.start <= other.start && this.end >= other.start) ||
      (this.start <= other.end && this.end >= other.end) ||
      other.fullyContains(this)
    )
  }

  static pairFromLine(line: string): [Range, Range] {
    return line
      .split(',')
      .map((r) => r.split('-').map((str) => Number(str)))
      .map(([start, end]) => new Range(start, end)) as [Range, Range]
  }
}

const ranges = readFileSync('04/input.txt')
  .toString()
  .split(/\r*\n/)
  .map(Range.pairFromLine)

const part1 = ranges.filter(
  ([range1, range2]) =>
    range1.fullyContains(range2) || range2.fullyContains(range1)
).length

console.log(part1)

const part2 = ranges.filter(([range1, range2]) =>
  range1.overlaps(range2)
).length

console.log(part2)
