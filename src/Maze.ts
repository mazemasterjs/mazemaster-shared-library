import seedrandom from 'seedrandom';
import Cell from './Cell';
import { CELL_TAGS, CELL_TRAPS, DIRS } from './Enums';
import { LOG_LEVELS, Logger } from '@mazemasterjs/logger';
import { MazeLoc } from './MazeLoc';
import { getEnvVar } from './Helpers';
import { MazeBase } from './MazeBase';

const log = Logger.getInstance();

let recurseDepth: number = 0; // tracks the level of recursion during path carving
let maxRecurseDepth: number = 0; // tracks the deepest level of carve recursion seen
let startGenTime: number = 0; // used to determine time spent generating a maze
let solutionPath: string[]; // used for the maze solver
let playerPos: MazeLoc; // used for the maze solver

// maze settings with defaults - will be replaced
// by loadEnvVars() in constructor
const MAZE_MAX_HEIGHT: number = getEnvVar('MAZE_MAX_HEIGHT', 'number');
const MAZE_MIN_HEIGHT: number = getEnvVar('MAZE_MIN_HEIGHT', 'number');
const MAZE_MAX_WIDTH: number = getEnvVar('MAZE_MAX_WIDTH', 'number');
const MAZE_MIN_WIDTH: number = getEnvVar('MAZE_MIN_WIDTH', 'number');
const TRAPS_MIN_CHALLENGE: number = getEnvVar('TRAPS_MIN_CHALLENGE', 'number');
const TRAPS_ON_PATH_MIN_CHALLENGE: number = getEnvVar('TRAPS_ON_PATH_MIN_CHALLENGE', 'number');

export class Maze extends MazeBase {
  /**
   * Instantiates or new or pre-loaded Maze object
   * @param data - JSON Object containing stubbed maze data
   */
  constructor(data?: any) {
    super();

    // load MazeBase from data, if provided
    if (data !== undefined) {
      super.loadData(data);
    }
  }

  /**
   * Generates a new maze based on the given parameters
   * @param height - number: The height of the maze grid
   * @param width - number: The width of the maze grid
   * @param challengeLevel - number: The difficulty level (1 to 10) of the maze being generated
   * @param name - string: the name of the maze
   * @param seed - string: pseudo random number generator seed value.  If empty, maze will be random and unrepeatable
   */
  public generate(height: number, width: number, challengeLevel: number, name: string, seed: string): this {
    const method = `generate(${height},${width},${challengeLevel},${name},${seed})`;
    this.logTrace(__filename, method, 'Test...');

    if (this.cells.length > 0) {
      log.warn(__filename, method, 'This maze has already been generated.');
      return this;
    }

    // Validate the input params - TypeScript's type safety checking doesn't seem to prevent
    // coercion when the parameter source is a raw JSON object
    this.validateAndSetGenParams(height, width, challengeLevel, name, seed);

    // start the generation
    log.info(__filename, method, `Generating new ${height} (height) x ${width} (width) maze with seed "${seed}"`);
    startGenTime = Date.now();

    // seedrandom generates seeded random numbers - allows the same maze to be generated consistently
    // when the same parameters are given
    seedrandom(this.seed, { global: true });

    // set maze's ID
    this.id = `${height}:${width}:${challengeLevel}:${seed}`;

    // build the empty cells array
    this.cells = new Array(height);
    for (let row: number = 0; row < height; row++) {
      const cols: Array<Cell> = new Array();
      for (let col: number = 0; col < width; col++) {
        const cell: Cell = new Cell();
        cell.Location = new MazeLoc(row, col);
        this.logTrace(__filename, 'buildCellsArray()', `Adding cell in position [${row}, ${col}]`);
        cols.push(cell);
      }
      this.cells[row] = cols;
    }

    this.logDebug(__filename, method, `Generated grid of ${height * width} empty cells.`);

    // randomize start and finish locations
    const startCol: number = Math.floor(Math.random() * width);
    const finishCol: number = Math.floor(Math.random() * width);

    this.logDebug(__filename, method, `Adding START ([0, ${startCol}]) and FINISH ([${height - 1}, ${finishCol}) cells.`);

    // tag start and finish columns (start / finish tags force matching exits on edge)
    this.startCell = new MazeLoc(0, startCol);
    this.cells[0][startCol].addTag(CELL_TAGS.START);
    this.cells[0][startCol].addTag(CELL_TAGS.CARVED);

    this.finishCell = new MazeLoc(height - 1, finishCol);
    this.cells[height - 1][finishCol].addTag(CELL_TAGS.FINISH);

    // start the carving routine
    this.logDebug(__filename, method, 'Starting carvePassage() from Start Cell: ' + this.startCell.toString());
    this.carvePassage(this.getCell(new MazeLoc(this.StartCell.row, this.startCell.col)));
    this.logDebug(__filename, method, 'carvePassage() complete.');

    // now solve the maze and tag the path
    recurseDepth = 0;
    this.logDebug(__filename, method, 'Starting solveAndTag() from Start Cell: ' + this.startCell.toString());
    this.solveAndTag();
    this.logDebug(__filename, method, `Solution complete, shortest path is ${this.ShortestPathLength} steps.`);

    // then add some traps...
    if (this.challenge >= TRAPS_MIN_CHALLENGE) {
      this.addTraps();
    } else {
      this.logDebug(__filename, method, `Challenge Level [${this.challenge}] below trap threshold [${TRAPS_MIN_CHALLENGE}].`);
    }

    // render the maze so the text rendering is set
    this.generateTextRender(true);

    this.logDebug(__filename, method, 'Maze generation completed.');
    if (log.LogLevel >= LOG_LEVELS.TRACE) {
      this.logTrace(__filename, method, this.getMazeStatsString());
    }
    return this;
  }

  /**
   * Wraps the recursive tagSolution function
   * and initializes tracking variables
   */
  public solveAndTag() {
    playerPos = new MazeLoc(this.startCell.row, this.startCell.col);
    solutionPath = new Array<string>();
    this.tagSolution(playerPos, 0);
  }

  /**
   * Carves passages out of a new maze grid that has no exits set
   * Only trace logging in here due to recursive log spam
   * @param cell
   */
  private carvePassage(cell: Cell) {
    recurseDepth++;
    if (recurseDepth > maxRecurseDepth) {
      maxRecurseDepth = recurseDepth;
    } // track deepest level of recursion during generation

    this.logTrace(__filename, 'carvePassage()', `[RD:${recurseDepth}] Carving STARTED from [${cell.Location.toString()}].`);

    // randomly sort an array of bitwise directional values (see also: Enums.DIRS)
    const dirs = [1, 2, 4, 8].sort((a, b) => {
      return 0.5 - Math.random();
    });

    // wander through the grid using randomized directions provided in dirs[],
    // carving out cells by adding exits as we go

    for (const dir of dirs) {
      let nextRow: number = cell.Location.row;
      let nextCol: number = cell.Location.col;

      // move location of next cell in the random direction
      if (dir > DIRS.SOUTH) {
        nextCol = dir === DIRS.EAST ? nextCol + 1 : nextCol - 1;
      } else {
        nextRow = dir === DIRS.NORTH ? nextRow - 1 : nextRow + 1;
      }

      try {
        // if the next call has valid grid coordinates, get it and try to carve into it
        if (nextRow >= 0 && nextRow < this.cells.length && nextCol >= 0 && nextCol < this.cells[0].length) {
          this.logTrace(__filename, 'carvePassage()', `[RD:${recurseDepth}] Next step, ${DIRS[dir]} to [${nextRow}, ${nextCol}].`);
          const nextCell: Cell = this.cells[nextRow][nextCol];

          if (!(nextCell.Tags & CELL_TAGS.CARVED)) {
            // if (!(nextCell.getTags() & CELL_TAGS.CARVED) && !(cell.getExits() & dir)) {
            // attempt to add an exit into the next room

            if (this.addExit(cell, dir)) {
              // this is a good move, so mark the cell as carved and enter it to continue carving
              nextCell.addTag(CELL_TAGS.CARVED);
              this.carvePassage(nextCell);
            } else {
              this.logTrace(
                __filename,
                'carvePassage()',
                `[RD:${recurseDepth}] Skipping step ${DIRS[dir]} - exit already set from [%s] to [${nextRow}, ${nextCol}].`,
              );
            }
          } else {
            this.logTrace(
              __filename,
              'carvePassage()',
              `[RD:${recurseDepth}]Cell to the ${DIRS[dir]} is already carved, skipping step from ${cell.Location.toString()} to [${nextRow}, ${nextCol}].`,
            );
          }
        } else {
          this.logTrace(
            __filename,
            'carvePassage()',
            `[RD:${recurseDepth}] Invalid direction, skipping step ${DIRS[dir]} from ${cell.Location.toString()} to [${nextRow}, ${nextCol}].`,
          );
        }
      } catch (error) {
        // somehow still grabbed an invalid cell
        log.error(__filename, 'carvePassage()', `Error getting cell ${nextRow}, ${nextCol}.`, error);
      }
    }

    // exiting the function relieves one level of recursion
    recurseDepth--;
    this.logTrace(__filename, 'carvePassage()', `[RD:${recurseDepth} (max)] Carve COMPLETED for cell [${cell.Location.toString()}].`);
  }

  /**
   * Solves the maze and tags the solution path TAGS.PATH.
   * Only using trace logging in here because it's recursive and very noisy...
   *
   * @param cellPos
   * @param pathId
   */
  private tagSolution(cellPos: MazeLoc, pathId: number) {
    const method = `tagSolution(${cellPos.toString()}`;
    recurseDepth++;
    if (recurseDepth > maxRecurseDepth) {
      maxRecurseDepth = recurseDepth;
    } // track deepest level of recursion during generation
    let cell: Cell;

    this.logTrace(__filename, method, `R:${recurseDepth} P:${pathId} -> Solve pass started.`);

    // Attempt to get the cell - if it errors we can return from this call
    try {
      cell = this.getCell(cellPos);
    } catch (err) {
      log.warn(__filename, method, `R:${recurseDepth} P:${pathId} -> Invalid cell - solve pass ended.`);
      recurseDepth--;
      return;
    }

    // add the cell to the list of explored cells
    solutionPath.push(cell.Location.toString());

    // helpful vars
    const dirs = [DIRS.NORTH, DIRS.SOUTH, DIRS.EAST, DIRS.WEST];
    let moveMade = false;

    if (playerPos.equals(this.finishCell)) {
      this.logTrace(__filename, method, `R:${recurseDepth} P:${pathId} -> Solution found!`);
    } else {
      // update player location (global var), but don't move it once it finds the finish
      playerPos.row = cell.Location.row;
      playerPos.col = cell.Location.col;

      // loop through all directions until a valid move is found
      dirs.forEach(dir => {
        const cLoc: MazeLoc = cell.Location; // current position
        const nLoc: MazeLoc = new MazeLoc(cLoc.row, cLoc.col); // next position

        switch (dir) {
          case DIRS.NORTH:
            // start always has an exit on the north wall, but it's not usable
            if (!!(cell.Exits & DIRS.NORTH) && !(cell.Tags & CELL_TAGS.START)) {
              nLoc.row -= 1;
            }
            break;
          case DIRS.SOUTH:
            // finish always has an exit on the south wall, but it's not usable either
            if (!!(cell.Exits & DIRS.SOUTH) && !(cell.Tags & CELL_TAGS.FINISH)) {
              nLoc.row += 1;
            }
            break;
          case DIRS.EAST:
            if (!!(cell.Exits & DIRS.EAST)) {
              nLoc.col += 1;
            }
            break;
          case DIRS.WEST:
            if (!!(cell.Exits & DIRS.WEST)) {
              nLoc.col -= 1;
            }
            break;
        }

        // ensure that a move is being made, that the cell is not visited, and that we aren't already at the finish
        if (!nLoc.equals(cLoc) && solutionPath.indexOf(nLoc.toString()) < 0) {
          // update the path ID if moving into a new branch
          if (moveMade) {
            pathId++;
            this.logTrace(__filename, method, `R:${recurseDepth} P:${pathId} -> Moving ${DIRS[dir]} [NEW PATH] to cell ${nLoc.toString()}`);
          } else {
            this.logTrace(__filename, method, `R:${recurseDepth} P:${pathId} -> Moving ${DIRS[dir]} [CONTINUING PATH] to cell ${nLoc.toString()}`);
          }

          if (!playerPos.equals(this.finishCell)) {
            this.tagSolution(nLoc, pathId);
          }

          // mark that a move was made
          moveMade = true;
        }
      });

      if (!moveMade) {
        this.logTrace(__filename, method, `R:${recurseDepth} P:${pathId} -> [DEAD END] Cannot move from cell ${cell.Location.toString()}`);
      }
    }

    if (playerPos.equals(this.finishCell)) {
      this.logTrace(__filename, method, `R:${recurseDepth} P:${pathId} -> Adding [PATH] tag to  ${cell.Location.toString()}`);
      this.shortestPathLength++;

      // clear existing tags and add the path tag - traps come later
      cell.addTag(CELL_TAGS.PATH);
    }

    recurseDepth--;
    this.logTrace(__filename, method, `R:${recurseDepth} P:${pathId} -> Path complete.`);
  } // end tagSolution()

  // test if cell has a trap
  private hasTrap(cell: Cell): boolean {
    return cell.Traps > 0;
  }

  /**
   * Adds traps to the maze. Trap frequency and positioning changes based on maze challenge level.
   */
  private addTraps() {
    const fnName = 'addTraps()';
    let trapCount = 0;

    this.logDebug(__filename, fnName, `Generating traps for challenge level ${this.challenge} maze.`);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // made it this far - let's set some traps!
        const trapChance = 100 - this.challenge * 10;
        const trapRoll = Math.floor(Math.random() * 100);
        const cell = this.cells[y][x];

        if (trapRoll < trapChance) {
          this.logTrace(__filename, fnName, 'Trap Roll Failed (' + trapRoll + ' < ' + trapChance + '), no traps here :(');
          continue;
        }

        this.logTrace(__filename, fnName, 'Trap Roll Passed (' + trapRoll + ' >= ' + trapChance + '), time to set some traps! >:)');

        // traps only allowed if there are open cells on either side to allow jumping
        const exits = cell.Exits;
        const tags = cell.Tags;

        // bail out if we already have a trap here
        if (cell.Traps !== CELL_TRAPS.NONE) {
          this.logTrace(__filename, fnName, `Invalid trap location (Already Trapped): ${cell.Location.toString()}`);
          continue;
        }

        // no traps in start cell
        if (!!(tags & CELL_TAGS.START)) {
          this.logTrace(__filename, fnName, `Invalid trap location (Start Cell): ${cell.Location.toString()}`);
          continue;
        }

        // no traps in finish cell
        // TODO: Allow traps if there's a way to jump them?
        if (!!(tags & CELL_TAGS.FINISH)) {
          this.logTrace(__filename, fnName, `Invalid trap location (Finish Cell): ${cell.Location.toString()}`);
          continue;
        }

        // traps may only occur in locations where the player can jump over them
        // TODO: Rule may change if other ways to avoid traps (potions, items, secret doors, etc.) are added
        if (
          !(
            (!!(exits & DIRS.NORTH) && !!(exits & DIRS.SOUTH) && !(!!(exits & DIRS.WEST) || !!(exits & DIRS.EAST))) ||
            (!!(exits & DIRS.EAST) && !!(exits & DIRS.WEST) && !(!!(exits & DIRS.NORTH) || !!(exits & DIRS.SOUTH)))
          )
        ) {
          this.logTrace(__filename, fnName, `Invalid trap location (Unavoidable): ${cell.Location.toString()}`);
          continue;
        }

        // Traps on solution path have extra rules:
        //   1) Must obey challenge level
        //   2) Must not be placed on path along maze edges (to avoid blocking path to exit)
        if (!!(tags & CELL_TAGS.PATH)) {
          // enforce challenge level settings
          if (this.challenge < TRAPS_ON_PATH_MIN_CHALLENGE) {
            this.logDebug(__filename, fnName, `Invalid trap location (No Traps on Path at CL ${this.challenge}: ${cell.Location.toString()}`);
            continue;
          }

          // avoid blocking solution path along edges
          if (cell.Location.col === this.width - 1 || cell.Location.col === 0 || (cell.Location.row === this.height - 1 || cell.Location.row === 0)) {
            // and avoid T-Junctions, but allow dead-ends (four-way junctions not possible on edge)
            if (cell.getExitCount() > 2) {
              this.logTrace(__filename, fnName, `Invalid trap location (On Edge & On Path): ${cell.Location.toString()}`);
              continue;
            }
          }
        }

        // don't double-up on traps - check north
        if (y > 0 && !!(exits & DIRS.NORTH) && this.hasTrap(this.getNeighbor(cell, DIRS.NORTH))) {
          this.logTrace(__filename, fnName, `Invalid trap location (Adjacent Trap - North): ${cell.Location.toString()}`);
          continue;
        }

        // don't double-up on traps - check south
        if (y < this.height - 1 && !!(exits & DIRS.SOUTH) && this.hasTrap(this.getNeighbor(cell, DIRS.SOUTH))) {
          this.logTrace(__filename, fnName, `Invalid trap location (Adjacent Trap - South): ${cell.Location.toString()}`);
          continue;
        }

        // don't double-up on traps - check east
        if (x < this.width - 1 && !!(exits & DIRS.EAST) && this.hasTrap(this.getNeighbor(cell, DIRS.EAST))) {
          this.logTrace(__filename, fnName, `Invalid trap location (Adjacent Trap - East): ${cell.Location.toString()}`);
          continue;
        }

        // don't double-up on traps - check east
        if (x > 0 && !!(exits & DIRS.WEST) && this.hasTrap(this.getNeighbor(cell, DIRS.WEST))) {
          this.logTrace(__filename, fnName, `Invalid trap location (Adjacent Trap - West): ${cell.Location.toString()}`);
          continue;
        }

        // randomly select which trap to lay
        const trapNum = Math.floor(Math.random() * (Object.keys(CELL_TRAPS).length / 2));
        this.logTrace(__filename, fnName, 'Setting trap #' + trapNum + ' in cell ' + cell.Location.toString());
        switch (trapNum) {
          case 0: {
            // zero means NONE.  Boo :(
            break;
          }
          case 1: {
            cell.addTrap(CELL_TRAPS.PIT);
            trapCount++;
            break;
          }
          case 2: {
            cell.addTrap(CELL_TRAPS.MOUSETRAP);
            trapCount++;
            break;
          }
          case 3: {
            if (this.challenge >= 4) {
              cell.addTrap(CELL_TRAPS.TARPIT);
              trapCount++;
            }
            break;
          }
          case 4: {
            if (this.challenge >= 5) {
              cell.addTrap(CELL_TRAPS.FLAMETHROWER);
              trapCount++;
            }
            break;
          }
          case 5: {
            if (this.challenge >= 6) {
              cell.addTrap(CELL_TRAPS.DEADFALL);
              trapCount++;
            }
            break;
          }
          case 6: {
            if (this.challenge >= 7) {
              cell.addTrap(CELL_TRAPS.POISON_DART);
              trapCount++;
            }
            break;
          }
          case 7: {
            if (this.challenge >= 8) {
              cell.addTrap(CELL_TRAPS.FRAGILE_FLOOR);
              trapCount++;
            }
            break;
          }
          case 8: {
            if (this.challenge >= 9) {
              cell.addTrap(CELL_TRAPS.TELEPORTER);
              trapCount++;
            }
            break;
          }
          case 9: {
            if (this.challenge >= 10) {
              cell.addTrap(CELL_TRAPS.CHEESE);
              trapCount++;
            }
            break;
          }
          default: {
            this.logTrace(__filename, fnName, `Invalid trap number: ${trapNum}`);
          }
        }
      }
    }
    this.trapCount = trapCount;
    this.logDebug(__filename, fnName, `addTraps() complete. Trap count: ${trapCount} (${Math.round((trapCount / (this.height * this.width)) * 100)}%)`);
  }

  /**
   * Validates generation parameters. Throws error on failure, sets class properties on success.
   *
   * @param height
   * @param width
   * @param challengeLevel
   * @param name
   * @param seed
   */
  private validateAndSetGenParams(height: number, width: number, challengeLevel: number, name: string, seed: string) {
    const method = `validateAndSetGenParams(${height},${width},${challengeLevel},${name},${seed})`;
    const errors = new Array<string>();

    this.logDebug(__filename, method, 'Validating maze generation parameters...');

    if (errors.length === 0 && typeof height === 'string') {
      log.warn(__filename, method, 'Height is of type string, expected type number! Attempting conversion...');
      height = parseInt(height, 10);
    }

    if (errors.length === 0 && typeof width === 'string') {
      log.warn(__filename, method, 'Width is of type string, expected type number! Attempting conversion...');
      width = parseInt(width, 10);
    }

    if (errors.length === 0 && typeof challengeLevel === 'string') {
      log.warn(__filename, method, 'challengeLevel is of type string, expected type number! Attempting conversion...');
      challengeLevel = parseInt(challengeLevel, 10);
    }

    // check for valid height
    if (height < MAZE_MIN_HEIGHT || this.height > MAZE_MAX_HEIGHT) {
      errors.push(`Maze height must be between ${MAZE_MIN_HEIGHT} and ${MAZE_MAX_HEIGHT}.\n\r`);
    }

    // check for valid width
    if (width < MAZE_MIN_WIDTH || this.height > MAZE_MAX_WIDTH) {
      errors.push(`Maze width must be between ${MAZE_MIN_WIDTH} and ${MAZE_MAX_WIDTH}.\n\r`);
    }

    // check for valid challenge level
    if (challengeLevel < 1 || challengeLevel > 10) {
      errors.push('Maze challengeLevel must be between 1 and 10, inclusive.\n\r');
    }

    // check for valid name
    if (name.length < 3 || name.length > 32) {
      errors.push('Maze name must be at least three and no more than 32 characters long.\n\r');
    }

    // check for valid seed
    if (seed.length < 3 || seed.length > 32) {
      errors.push('Maze seed must be at least three and no more than 32 characters long.\n\r');
    }

    // throw an error if any of the parameters aren't met
    if (errors.toString().length > 0) {
      const error: Error = new Error(errors.toString());
      log.error(__filename, method, 'Errors detected.', error);
      throw error;
    }

    // validation successful, go ahead and assign to properties
    this.height = height;
    this.width = width;
    this.challenge = challengeLevel;
    this.name = name;
    this.seed = seed;

    // good deal - moving on...
    this.logDebug(__filename, method, 'Maze generation parameters validated and set.');
  }

  /**
   * Generates a string of maze stats for debug/trace logging
   */
  private getMazeStatsString(): string {
    let statString = 'Maze Details:\r\n';
    statString += '------------\r\n';
    statString += `ID = ${this.id}\r\n`;
    statString += `Name = ${this.name}\r\n`;
    statString += `Seed = ${this.seed === '' ? 'NO_SEED' : this.seed}\r\n`;
    statString += `Rows = ${this.cells.length}\r\n`;
    statString += `Columns = ${this.cells[0].length}\r\n`;
    statString += `Challenge Level = ${this.challenge}\r\n`;
    statString += `Generation Time = ${Date.now() - startGenTime}ms\r\n`;
    statString += `Max Recursion = ${maxRecurseDepth}\r\n`;
    statString += `Cell Count = ${this.CellCount}\r\n`;
    statString += `Trap Count = ${this.TrapCount}\r\n`;
    statString += `Shortest Path = ${this.ShortestPathLength}\r\n`;
    statString += `Text Render:${this.textRender}\r\n\r\n`;
    return statString;
  }
}

export default Maze;
