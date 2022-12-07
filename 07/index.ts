import { readFileSync } from 'fs'
import { exit } from 'process'

const getPathPieces = (path: string): string[] =>
  path
    .replace(/^\//g, '')
    .split('/')
    .filter((piece) => piece.length > 0)

class FileSystem {
  public path: string = '/'

  constructor(public rootDir: Directory) {}

  public changeDirectory(path: string): void {
    if (path.startsWith('/')) {
      this.path = path
      return
    }

    if (path === '..') {
      if (this.path === '/') {
        throw new Error("Can't go up from root")
      }
      this.path = '/' + getPathPieces(this.path).slice(0, -1).join('/')
      return
    }

    this.path = '/' + [...getPathPieces(this.path), path].join('/')
  }

  public getDirectory(absolutePath: string): Directory {
    const directoryPaths = getPathPieces(absolutePath).filter(
      (entry) => !!entry
    )
    let currentDir = this.rootDir

    while (directoryPaths.length > 0) {
      if (!currentDir.contents) {
        throw new Error(`Can't get directory contents ${currentDir.path}`)
      }
      const entryName = directoryPaths.shift()
      const dir = currentDir.contents.find(
        (entry) => entry.entryName === entryName
      )
      if (!dir) {
        throw new Error(`Could not find entry ${currentDir.path}/${entryName}`)
      }
      if (!(dir instanceof Directory)) {
        throw new Error(
          `Can't open file as directory ${currentDir.path}/${entryName} (${
            dir instanceof File
          })`
        )
      }
      currentDir = dir
    }
    return currentDir
  }
}

abstract class Entry {
  constructor(public path: string) {}
  public abstract size: number

  public get entryName(): string {
    return this.path.split('/').at(-1)!
  }
}

class File extends Entry {
  constructor(public path: string, public size: number) {
    super(path)
  }
}

class Directory extends Entry {
  public contents: undefined | Entry[] = undefined

  public get size(): number {
    if (!this.contents)
      throw new Error(`Directory ${this.path} not initialized!`)
    return this.contents.reduce((sum, entry) => sum + entry.size, 0)
  }

  public setContents(lsOutput: string[]) {
    if (this.contents) {
      throw new Error(`Can't initialize a folder twice! ${this.path}`)
    }
    this.contents = lsOutput.map((line) => {
      const path = [...getPathPieces(this.path), line.split(' ')[1]].join('/')
      return line.split(' ')[0] === 'dir'
        ? new Directory(path)
        : new File(path, Number(line.split(' ')[0]))
    })
  }
}

type Command = ChangeDirectory | ListDirectory

class ChangeDirectory {
  constructor(public relativePath: string) {}
}

class ListDirectory {
  public output: string[] = []
}

// ======================== SCRIPT START ===========================

const lines = readFileSync('07/input.txt').toString().split(/\r*\n/)

const commands = lines.reduce((commands, line) => {
  if (line.startsWith('$')) {
    const command =
      line.split(' ')[1] === 'cd'
        ? new ChangeDirectory(line.split(' ')[2])
        : new ListDirectory()
    commands.push(command)
    return commands
  }
  const previousCommand = commands.at(-1)!
  if (previousCommand instanceof ChangeDirectory)
    throw new Error("Can't append output to cd-command!")
  previousCommand.output.push(line)
  return commands
}, [] as Command[])

const fs = new FileSystem(new Directory('/'))

// set up filesystem
for (const command of commands) {
  if (command instanceof ChangeDirectory) {
    // console.log('Changing directory: ', {
    //   old: fs.path,
    //   change: command.relativePath,
    // })
    fs.changeDirectory(command.relativePath)
  } else {
    // console.log('Listing directory: ', {
    //   path: fs.path,
    //   output: command.output,
    // })
    const dir = fs.getDirectory(fs.path)
    dir.setContents(command.output)
  }
}
// console.log('\n================= FILE SYSTEM =================\n')
// console.log(JSON.stringify(fs, null, 2))
// console.log('\n===============================================\n')

// part 1
// query filesystem for sub 100k directories, depth first

const selectedDirectories: Directory[] = []
const SMALL_DIR_LIMIT = 100_000
function findSubDirsUnder100k(directory: Directory) {
  if (!directory.contents) {
    throw new Error(`Can't check uninitialized dir: ${directory.path}`)
  }
  if (directory.size <= SMALL_DIR_LIMIT) {
    selectedDirectories.push(directory)
  }

  for (const entry of directory.contents.filter(
    (entry) => entry instanceof Directory
  ) as Directory[]) {
    findSubDirsUnder100k(entry)
  }
}

findSubDirsUnder100k(fs.rootDir)
console.log(
  'Part 1:',
  selectedDirectories.reduce((sum, dir) => sum + dir.size, 0)
)

// part 2
// find smallest directory over 30m, depth first

let selectedDirectory: Directory = fs.rootDir
const LARGE_DIR_LIMIT = fs.rootDir.size - (70_000_000 - 30_000_000)
function findSmallestSubdirOver30m(directory: Directory) {
  if (!directory.contents) {
    throw new Error(`Can't check uninitialized dir: ${directory.path}`)
  }

  if (directory.size >= LARGE_DIR_LIMIT) {
    if (directory.size < selectedDirectory.size) {
      selectedDirectory = directory
    }
    for (const entry of directory.contents.filter(
      (entry) => entry instanceof Directory
    ) as Directory[]) {
      findSmallestSubdirOver30m(entry)
    }
  }
}

findSmallestSubdirOver30m(fs.rootDir)
console.log('Part 2:', selectedDirectory.size)
