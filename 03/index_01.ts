import { readFileSync } from 'fs'

const splitLine = (line: string): [string, string] => [
  line.slice(0, line.length / 2),
  line.slice(line.length / 2),
]

const getCharacterPresentInBoth = ([str1, str2]: [string, string]): string =>
  str1.split('').find((char1) => str2.includes(char1)) as string

const getCharacterPriority = (char: string) =>
  char.charCodeAt(0) - (/[a-z]/.test(char) ? 96 : 38)

const output = readFileSync('03/input.txt')
  .toString()
  .split(/\r*\n/)
  .map(splitLine)
  .map(getCharacterPresentInBoth)
  .map(getCharacterPriority)
  .reduce((sum, priority) => sum + priority, 0)

console.log(output)
