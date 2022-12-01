import { readFileSync } from 'fs'

class Elf {
  constructor(public calories: number[]) {}

  public get totalCalories(): number {
    return this.calories.reduce((sum, val) => sum + val, 0)
  }

  public toString() {
    return `<Elf totalCalories=${this.totalCalories}>`
  }
}

const elves = readFileSync('01/input.txt')
  .toString()
  .split(/\r*\n/)
  .map((str) => (str === '' ? null : Number(str)))
  .reduce(
    (chunks, value) => {
      if (!value) {
        chunks.push([])
      } else {
        chunks[chunks.length - 1].push(value)
      }
      return chunks
    },
    [[]] as number[][]
  )
  .map((chunk) => new Elf(chunk))

// answer for challenge 1
const richestElf = elves.sort((a, b) => b.totalCalories - a.totalCalories)[0]
console.log(richestElf.totalCalories)

// answer for challenge 2
const topThreeElves = elves
  .sort((a, b) => b.totalCalories - a.totalCalories)
  .slice(0, 3)
const calorySum = topThreeElves.reduce((sum, elf) => sum + elf.totalCalories, 0)
console.log(calorySum)
