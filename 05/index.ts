import { readFileSync } from 'fs'

type Move = {
  from: number
  to: number
  count: number
}

class Stack<T> {
  constructor(private array: T[] = []) {}

  public pop(count = 1): T[] {
    if (this.array.length < count) {
      throw new Error(
        `Too few items to pop! count=${count}, length=${this.array.length} `
      )
    }

    return this.array.splice(this.array.length - count)!
  }

  public add(items: T[]): void {
    this.array.push(...items)
  }

  public peek(): T {
    if (this.array.length === 0) {
      throw new Error('Nothing to peek!')
    }
    return this.array.at(-1)!
  }
}

class Port<T> {
  constructor(private stacks: Stack<T>[]) {}

  public move(from: number, to: number, count: number) {
    for (let i = 0; i < count; i++) {
      this.stacks[to - 1].add(this.stacks[from - 1].pop())
    }
  }

  public move9001(from: number, to: number, count: number) {
    console.log('Before:', {
      from: this.stacks[from - 1],
      to: this.stacks[to - 1],
      count,
    })
    this.stacks[to - 1].add(this.stacks[from - 1].pop(count))
    console.log('After:', {
      from: this.stacks[from - 1],
      to: this.stacks[to - 1],
    })
  }

  public getTopCrates(): T[] {
    return this.stacks.map((stack) => stack.peek())
  }

  static fromInitialState(lines: string[]): Port<string> {
    const stackCount = (lines[0].length + 1) / 4
    const stacks = Array.apply(null, Array(stackCount)).map(
      (_) => new Stack<string>()
    )
    lines
      .map((line) =>
        Array.from(line.match(/.{1,4}/g) as RegExpMatchArray)
          .map((token) => token.substring(1, 2))
          .map((token) => (token == ' ' ? null : token))
      )
      .filter((line) => isNaN(Number(line[0])))
      .reverse()
      .forEach((line) =>
        line.forEach((crate, index) =>
          crate !== null ? stacks[index].add([crate]) : null
        )
      )
    return new Port<string>(stacks)
  }
}

const input = readFileSync('05/input.txt').toString().split(/\r*\n/)

const initialState = []
for (const line of input) {
  if (line.trim() == '') break
  initialState.push(line)
}

const port = Port.fromInitialState(initialState)

const moves = input
  .filter((line) => line.startsWith('move'))
  .map((line) => {
    const [count, from, to] = line
      .split(' ')
      .filter((token) => !isNaN(Number(token)))
      .map((token) => Number(token))
    return { count, from, to } as Move
  })

moves.forEach((move) => port.move(move.from, move.to, move.count))
console.log(port.getTopCrates().join(''))

const initialState2 = []
for (const line of input) {
  if (line.trim() == '') break
  initialState2.push(line)
}
const port2 = Port.fromInitialState(initialState2)
moves.forEach((move) => port2.move9001(move.from, move.to, move.count))
console.log(port2.getTopCrates().join(''))

// const example = [
//   '    [D]    ',
//   '[N] [C]    ',
//   '[Z] [M] [P]',
//   ' 1   2   3 ',
//   '',
//   'move 1 from 2 to 1',
//   'move 3 from 1 to 3',
//   'move 2 from 2 to 1',
//   'move 1 from 1 to 2',
// ]
