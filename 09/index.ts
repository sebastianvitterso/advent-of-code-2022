import { readFileSync } from 'fs'

// Y
// ^
// |
// |
//  -----> X

type Coordinate = { x: number; y: number }

type CoordinateString = `${number},${number}`
const coordinateString = ({ x, y }: Coordinate): CoordinateString => `${x},${y}`

type Direction = 'R' | 'U' | 'L' | 'D'

type Move = { direction: Direction; length: number }

class Map {
  knotPositionLog: Set<CoordinateString>[]
  knotPositions: Coordinate[]

  constructor(knotCount: number) {
    if (knotCount <= 0) throw Error('Needs at least one knot!')
    this.knotPositionLog = Array.apply(null, Array(knotCount)).map((_) => new Set<CoordinateString>(['0,0']))
    this.knotPositions = Array.apply(null, Array(knotCount)).map((_) => ({ x: 0, y: 0 }))
  }

  public move(move: Move) {
    const head = this.knotPositions[0]
    for (let i = 0; i < move.length; i++) {
      switch (move.direction) {
        case 'U':
          head.y++
          break
        case 'R':
          head.x++
          break
        case 'D':
          head.y--
          break
        case 'L':
          head.x--
          break
      }
      this.knotPositionLog[0].add(coordinateString(head))

      this.propagate()

      this.print()
    }
  }

  private propagate() {
    for (let i = 1; i < this.knotPositions.length; i++) {
      const headKnot = this.knotPositions[i - 1]
      const currentKnot = this.knotPositions[i]
      while (Math.abs(headKnot.x - currentKnot.x) > 1 || Math.abs(headKnot.y - currentKnot.y) > 1) {
        if (Math.abs(headKnot.x - currentKnot.x) > 1) {
          if (Math.abs(headKnot.y - currentKnot.y) > 0) {
            currentKnot.y += Math.sign(headKnot.y - currentKnot.y)
          }

          currentKnot.x += Math.sign(headKnot.x - currentKnot.x)
          this.knotPositionLog[i].add(coordinateString(currentKnot))
          break
        }

        if (Math.abs(headKnot.y - currentKnot.y) > 1) {
          if (Math.abs(headKnot.x - currentKnot.x) > 0) {
            currentKnot.x += Math.sign(headKnot.x - currentKnot.x)
          }

          currentKnot.y += Math.sign(headKnot.y - currentKnot.y)
          this.knotPositionLog[i].add(coordinateString(currentKnot))
          break
        }
      }
    }
  }

  public print() {
    console.log(this.knotPositions.map(coordinateString).join('|'))
  }
}

const moves = readFileSync('09/input.txt')
  .toString()
  .split(/\r*\n/)
  .map((line) => line.split(' '))
  .map(([dir, length]) => ({ direction: dir, length: Number(length) } as Move))

const map1 = new Map(2)
moves.forEach((move) => map1.move(move))
console.log('PART 1:', map1.knotPositionLog[1].size)

const map2 = new Map(10)
moves.forEach((move) => map2.move(move))
console.log('PART 2:', map2.knotPositionLog[9].size)
