import { readFileSync } from 'fs'

const elfMoves = ['A', 'B', 'C'] as const
const outcomes = ['X', 'Y', 'Z'] as const
const moves = ['rock', 'paper', 'scissors'] as const

type ElfMove = typeof elfMoves[number]
type Outcome = typeof outcomes[number]
type Move = typeof moves[number]

const convertElfMoveToMove = (elfMove: ElfMove): Move =>
  moves[elfMoves.indexOf(elfMove)]
const convertElfMoveAndOutcomeToMove = (
  elfMove: ElfMove,
  outcome: Outcome
): Move => {
  const elfMoveAsMove = convertElfMoveToMove(elfMove)
  switch (outcome) {
    case 'X': // loss
      return moves[(moves.indexOf(elfMoveAsMove) + 2) % 3]
    case 'Y': // draw
      return elfMoveAsMove
    case 'Z': // win
      return moves[(moves.indexOf(elfMoveAsMove) + 1) % 3]
  }
  return moves[outcomes.indexOf(outcome)]
}

class Round {
  constructor(private elfMove: Move, private youMove: Move) {}

  public get matchScore(): number {
    const diff =
      (moves.indexOf(this.youMove) - moves.indexOf(this.elfMove) + 3) % 3
    switch (diff) {
      case 0:
        return 3
      case 1:
        return 6
      case 2:
        return 0
    }
    throw Error('what dude')
  }

  public get moveScore(): number {
    return moves.indexOf(this.youMove) + 1
  }

  public get score(): number {
    return this.matchScore + this.moveScore
  }
}

const rounds = readFileSync('02/input.txt')
  .toString()
  .split(/\r*\n/)
  .map((str) => str.split(' '))
  .map(([elfMove, outcome]) => [
    convertElfMoveToMove(elfMove as ElfMove),
    convertElfMoveAndOutcomeToMove(elfMove as ElfMove, outcome as Outcome),
  ])
  .map(([elfMove, youMove]) => new Round(elfMove, youMove))
  .reduce((sum, round) => sum + round.score, 0)

console.log(rounds)
