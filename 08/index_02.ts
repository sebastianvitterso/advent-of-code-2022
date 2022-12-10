import { readFileSync } from 'fs'

const lines = readFileSync('08/input.txt').toString().split(/\r*\n/)

const input = lines.map((line) => line.split('').map((digit) => Number(digit)))

function getScenicScoreGrid(): number[][] {
  return input.map((line, y) => line.map((tree, x) => getScenicScore(x, y)))
}

function getScenicScore(x: number, y: number): number {
  // console.log({
  //   x,
  //   y,
  //   up: getScenicScoreUp(x, y),
  //   down: getScenicScoreDown(x, y),
  //   left: getScenicScoreLeft(x, y),
  //   right: getScenicScoreRight(x, y),
  // })
  return (
    getScenicScoreUp(x, y) *
    getScenicScoreDown(x, y) *
    getScenicScoreLeft(x, y) *
    getScenicScoreRight(x, y)
  )
}

function getScenicScoreUp(x: number, y: number): number {
  const tree = input[y][x]
  let treeCount = 0

  for (let yi = y - 1; yi >= 0; yi--) {
    const iterTree = input[yi][x]
    if (iterTree >= tree) {
      treeCount++
      break
    }

    treeCount++
  }
  return treeCount
}

function getScenicScoreDown(x: number, y: number): number {
  const tree = input[y][x]
  let treeCount = 0

  for (let yi = y + 1; yi < input.length; yi++) {
    const iterTree = input[yi][x]
    if (iterTree >= tree) {
      treeCount++
      break
    }

    treeCount++
  }
  return treeCount
}

function getScenicScoreLeft(x: number, y: number): number {
  const tree = input[y][x]
  let treeCount = 0

  for (let xi = x - 1; xi >= 0; xi--) {
    const iterTree = input[y][xi]
    if (iterTree >= tree) {
      treeCount++
      break
    }

    treeCount++
  }
  return treeCount
}

function getScenicScoreRight(x: number, y: number): number {
  const tree = input[y][x]
  let treeCount = 0

  for (let xi = x + 1; xi < input[y].length; xi++) {
    const iterTree = input[y][xi]
    if (iterTree >= tree) {
      treeCount++
      break
    }

    treeCount++
  }
  return treeCount
}
// console.log(input)
// console.log(getScenicScoreGrid())
console.log(Math.max(...getScenicScoreGrid().map((row) => Math.max(...row))))
