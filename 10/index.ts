import { readFileSync } from 'fs'

type Operation = Noop | Addx

type Noop = null
type Addx = number

const operations: Operation[] = readFileSync('10/input.txt')
  .toString()
  .split(/\r*\n/)
  .map((line) => {
    const tokens = line.split(' ')
    if (tokens.length > 1) {
      return Number(tokens[1])
    }
    return null
  })

const retimedOperations = operations.reduce((list, current) => {
  list.push(null)
  if (current !== null) list.push(current)
  return list
}, [] as Operation[])

let i = 0
let x = 1
const signalStrengths = []
const signalPoints = [20, 60, 100, 140, 180, 220]

const lines = [[], [], [], [], [], []] as string[][]
for (const op of retimedOperations) {
  i++
  const currentLine = Math.floor(i / 40)
  const linePosition = i % 40

  if ([x, x + 1, x + 2].includes(linePosition)) {
    lines[currentLine]?.push('#')
  } else {
    lines[currentLine]?.push('.')
  }

  console.log(currentLine, linePosition)

  if (signalPoints.includes(i)) {
    signalStrengths.push(x * i)
  }
  if (op !== null) {
    x += op
  }
}
console.log(
  signalStrengths,
  signalStrengths.reduce((sum, val) => sum + val, 0)
)

console.log(lines.map((line) => line.join('')).join('\n'))
