import { readFileSync } from 'fs'

const splitLine = (line: string): [string, string] => [
  line.slice(0, line.length / 2),
  line.slice(line.length / 2),
]

const getCharacterPresentInBoth = ([str1, str2]: [string, string]): string =>
  str1.split('').find((char1) => str2.includes(char1)) as string

const getCharacterPriority = (char: string) =>
  char.charCodeAt(0) - (/[a-z]/.test(char) ? 96 : 38)

const intersection = <T>(a: Set<T>, b: Set<T>): Set<T> =>
  new Set([...a].filter((x) => b.has(x)))

class Rucksack {
  constructor(public line: string) {}

  public get lineCharacterSet(): Set<string> {
    return new Set(this.line.split(''))
  }

  // public get pockets(): [string, string] {
  //   return splitLine(this.line)
  // }

  // public get characterPresentInBoth(): string {
  //   return getCharacterPresentInBoth(this.pockets)
  // }

  // public get characterPriority(): number {
  //   return getCharacterPriority(this.characterPresentInBoth)
  // }
}

class ElfGroup {
  constructor(public rucksacks: [Rucksack, Rucksack, Rucksack]) {}

  public get badgeCharacter(): string {
    const characterSet = this.rucksacks.reduce(
      (set: Set<string> | undefined, rucksack: Rucksack): Set<string> =>
        set !== undefined
          ? intersection(rucksack.lineCharacterSet, set)
          : rucksack.lineCharacterSet,
      undefined
    )
    if (characterSet === undefined) throw Error('whaaat...')
    if (characterSet.size === 0) throw Error('what!?')
    if (characterSet.size > 1) throw Error('WHAT!?')
    return Array.from(characterSet.values())[0]
  }

  public get characterPriority(): number {
    return getCharacterPriority(this.badgeCharacter)
  }
}

const output = readFileSync('03/input.txt')
  .toString()
  .split(/\r*\n/)
  .map((line) => new Rucksack(line))
  .reduce(
    (rucksackGroups, rucksack) => {
      if (rucksackGroups.at(-1)!.length === 3) rucksackGroups.push([])
      rucksackGroups.at(-1)!.push(rucksack)
      return rucksackGroups
    },
    [[]] as Rucksack[][]
  )
  .map(
    (rucksackGroup) =>
      new ElfGroup(rucksackGroup as [Rucksack, Rucksack, Rucksack])
  )
  .map((elfGroup) => elfGroup.characterPriority)
  .reduce((sum, priority) => sum + priority, 0)

console.log(output)
