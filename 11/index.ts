import { readFileSync } from 'fs'

type Operation = '*' | '+'

const monkeys: Monkey[] = []

class Monkey {
  public items: number[]

  constructor(
    public operation: Operation,
    public operationValue: number,
    public divisionTestValue: number,
    public trueReceiverId: number,
    public falseReceiverId: number,
    startingItems: number[]
  ) {
    this.items = startingItems
  }

  public get trueReceiverMonkey(): Monkey {
    return monkeys[this.trueReceiverId]
  }

  public get falseReceiverMonkey(): Monkey {
    return monkeys[this.falseReceiverId]
  }

  public catch(item: number) {
    this.items.push(item)
  }
}

const input = readFileSync('10/input.txt').toString().split(/\r*\n/)
