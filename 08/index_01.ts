import { readFileSync } from 'fs'

const lines = readFileSync('08/input.txt').toString().split(/\r*\n/)
// const lines = ['30373', '25512', '65332', '33549', '35390']

const input = lines.map((line) => line.split('').map((digit) => Number(digit)))

function getVisibilityGrid(): boolean[][] {
  return input.map((line, y) => line.map((tree, x) => isVisible(x, y)))
}

function isVisible(x: number, y: number): boolean {
  // console.log({
  //   x,
  //   y,
  //   top: isVisibleFromTop(x, y),
  //   bottom: isVisibleFromBottom(x, y),
  //   left: isVisibleFromLeft(x, y),
  //   right: isVisibleFromRight(x, y),
  // })
  return (
    isVisibleFromTop(x, y) ||
    isVisibleFromBottom(x, y) ||
    isVisibleFromLeft(x, y) ||
    isVisibleFromRight(x, y)
  )
}

function isVisibleFromTop(x: number, y: number): boolean {
  for (let yi = 0; yi < y; yi++) {
    if (input[yi][x] >= input[y][x]) return false
  }
  return true
}

function isVisibleFromBottom(x: number, y: number): boolean {
  for (let yi = y + 1; yi < input.length; yi++) {
    if (input[yi][x] >= input[y][x]) return false
  }
  return true
}

function isVisibleFromLeft(x: number, y: number): boolean {
  for (let xi = 0; xi < x; xi++) {
    if (input[y][xi] >= input[y][x]) return false
  }
  return true
}

function isVisibleFromRight(x: number, y: number): boolean {
  for (let xi = x + 1; xi < input[y].length; xi++) {
    if (input[y][xi] >= input[y][x]) return false
  }
  return true
}

console.log(getVisibilityGrid())

const visibleCount = getVisibilityGrid()
  .map((row) => row.filter((visible) => visible))
  .flat().length
console.log(visibleCount)
