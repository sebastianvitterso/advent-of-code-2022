import { readFileSync } from 'fs'

const elfMoves = ['A', 'B', 'C'] as const
const youMoves = ['X', 'Y', 'Z'] as const
const moves = ['rock', 'paper', 'scissors'] as const

type ElfMove = typeof elfMoves[number]
type YouMove = typeof youMoves[number]
type Move = typeof moves[number]

const convertElfMoveToMove = (elfMove: ElfMove): Move =>
  moves[elfMoves.indexOf(elfMove)]
const convertYouMoveToMove = (youMove: YouMove): Move =>
  moves[youMoves.indexOf(youMove)]

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
  .map(([elfMove, youMove]) => [
    convertElfMoveToMove(elfMove as ElfMove),
    convertYouMoveToMove(youMove as YouMove),
  ])
  .map(([elfMove, youMove]) => new Round(elfMove, youMove))
  .reduce((sum, round) => sum + round.score, 0)

console.log(rounds)
