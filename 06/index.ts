import { readFileSync } from 'fs'

class Log {
  private history: string[]
  private _counter: number = 0

  constructor(private historyLength: number) {
    this.history = Array.apply(null, new Array(this.historyLength)).map(
      (_) => '_'
    )
  }

  public addCharacter(char: string): void {
    this.history.shift()
    this.history.push(char)
    this._counter += 1
  }

  public markerDetected(): boolean {
    return this.history.every(
      (char) => this.history.filter((c) => c === char).length === 1
    )
  }

  public get counter() {
    return this._counter
  }
}

const input = readFileSync('06/input.txt').toString().split('')
const log1 = new Log(4)
for (const char of input) {
  log1.addCharacter(char)
  if (log1.markerDetected() && log1.counter >= 4) {
    break
  }
}
console.log(log1.counter)

const log2 = new Log(14)
for (const char of input) {
  log2.addCharacter(char)
  if (log2.markerDetected() && log2.counter >= 4) {
    break
  }
}
console.log(log2.counter)
