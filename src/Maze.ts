import seedrandom from 'seedrandom';
import { format as fmt } from 'util';
import Cell from './Cell';
import { CELL_TAGS, CELL_TRAPS, DIRS } from './Enums';
import Logger, { LOG_LEVELS } from './Logger';
import { Position } from './Position';

const log = Logger.getInstance();

let MAZE_MAX_CELL_COUNT: number = 2500; // control max maze size to prevent overflow due to recursion errors
let MAZE_MIN_DIMENSION_SIZE: number = 3; // The smallest allowed maze height & width
let MAZE_TRAPS_MIN_CL: number = 4; // the minimum maze challenge level that allows traps
let MAZE_TRAPS_ON_PATH_MIN_CL: number = 6; // the minimum maze challenge level that allows traps on the solution path

let recurseDepth: number = 0; // tracks the level of recursion during path carving
let maxRecurseDepth: number = 0; // tracks the deepest level of carve recursion seen
let startGenTime: number = 0; // used to determine time spent generating a maze

let solutionPath: Array<string>; // used for the maze solver
let playerPos: Position; // used for the maze solver

export class Maze {
    private id: string;
    private height: number;
    private width: number;
    private seed: string;
    private challenge: number;
    private cells: Array<Array<Cell>>;
    private textRender: string;
    private startCell: Position;
    private finishCell: Position;
    private shortestPathLength: number;
    private trapCount: number;
    private note: string;

    /**
     * Instantiates or new or pre-loaded Maze object
     * @param data - JSON Object containing stubbed maze data
     */
    constructor(data?: Maze) {
        if (data !== undefined) {
            this.height = data.height;
            this.width = data.width;
            this.seed = data.seed;
            this.challenge = data.challenge;
            this.textRender = data.textRender;
            this.id = data.id;
            this.startCell = data.startCell;
            this.finishCell = data.finishCell;
            this.shortestPathLength = data.shortestPathLength;
            this.trapCount = data.trapCount;
            this.note = data.note;
            this.cells = this.buildCellsArray(data.cells);
            this.config();
        } else {
            this.height = 0;
            this.width = 0;
            this.seed = '';
            this.challenge = 0;
            this.textRender = '';
            this.id = '';
            this.startCell = new Position(0, 0);
            this.finishCell = new Position(0, 0);
            this.shortestPathLength = 0;
            this.trapCount = 0;
            this.note = '';
            this.cells = new Array<Array<Cell>>();
            this.config();
        }
    }

    private config() {
        if (process.env.MAZE_MAX_CELL_COUNT) {
            MAZE_MAX_CELL_COUNT = parseInt(process.env.MAZE_MAX_CELL_COUNT + '');
            log.info(__filename, 'constructor', 'MAZE_MAX_CELL_COUNT environment variable found, using value: ' + MAZE_MAX_CELL_COUNT);
        } else {
            log.warn(__filename, 'config()', 'MAZE_MAX_CELL_COUNT environment variable not set, using default value: ' + MAZE_MAX_CELL_COUNT);
        }

        if (process.env.MAZE_MIN_DIMENSION_SIZE) {
            MAZE_MIN_DIMENSION_SIZE = parseInt(process.env.MAZE_MIN_DIMENSION_SIZE + '');
            log.info(__filename, 'constructor', 'MAZE_MIN_DIMENSION_SIZE environment variable found, using value: ' + MAZE_MIN_DIMENSION_SIZE);
        } else {
            log.warn(__filename, 'config()', 'MAZE_MIN_DIMENSION_SIZE environment variable not set, using default value: ' + MAZE_MIN_DIMENSION_SIZE);
        }

        if (process.env.MAZE_TRAPS_MIN_CL) {
            MAZE_TRAPS_MIN_CL = parseInt(process.env.MAZE_TRAPS_MIN_CL + '');
            log.info(__filename, 'constructor', 'MAZE_TRAPS_MIN_CL environment variable found, using value: ' + MAZE_TRAPS_MIN_CL);
        } else {
            log.warn(__filename, 'config()', 'MAZE_TRAPS_MIN_CL environment variable not set, using default value: ' + MAZE_TRAPS_MIN_CL);
        }

        if (process.env.MAZE_TRAPS_ON_PATH_MIN_CL) {
            MAZE_TRAPS_ON_PATH_MIN_CL = parseInt(process.env.MAZE_TRAPS_ON_PATH_MIN_CL + '');
            log.info(__filename, 'constructor', 'MAZE_TRAPS_ON_PATH_MIN_CL environment variable found, using value: ' + MAZE_TRAPS_ON_PATH_MIN_CL);
        } else {
            log.warn(__filename, 'config()', 'MAZE_TRAPS_ON_PATH_MIN_CL environment variable not set, using default value: ' + MAZE_TRAPS_ON_PATH_MIN_CL);
        }
    }

    /**
     * Rebuild the maze array from the given data to instantiate
     * each individual Cell object
     * @param cells
     */
    private buildCellsArray(cells: Array<Array<Cell>>): Array<Array<Cell>> {
        let newCells: Array<Array<Cell>> = new Array(this.height);

        for (let row: number = 0; row < this.height; row++) {
            let cols: Array<Cell> = new Array<Cell>();
            for (let col: number = 0; col < this.width; col++) {
                let cData = JSON.parse(JSON.stringify(cells[row][col]));
                let cell: Cell = new Cell(cData);
                log.trace(__filename, 'buildCellsArray()', fmt('Adding cell in position [%d, %d]', row, col));
                cols.push(cell);
            }
            newCells[row] = cols;
        }
        return newCells;
    }

    /**
     * Attempts to find and return the cell in the given position
     *
     * @param pos
     * @throws Out Of Bounds error if given position is outside of cells array's bounds.
     */
    public getCell(pos: Position): Cell {
        if (pos.row < 0 || pos.row >= this.cells.length || pos.col < 0 || pos.col > this.cells[0].length) {
            let error = new Error(fmt('Invalid cell coordinates given: [%d, %d].', pos.row, pos.col));
            log.error(__filename, fmt('getCell(%d, %d)', pos.row, pos.col), 'Cell range out of bounds, throwing error.', error);
            throw error;
        }

        log.trace(__filename, fmt('getCell(%s)', pos.toString()), 'Returning cell.');

        return this.cells[pos.row][pos.col];
    }

    /**
     * Calculates and returns neighboring cell in the given direction
     * TODO: Consider checking neighbor validity here?
     *
     * @param cell
     * @param dir
     */
    public getNeighbor(cell: Cell, dir: DIRS): Cell {
        // move location of next cell according to random direction
        let row = cell.getPosition().row;
        let col = cell.getPosition().col;

        log.trace(__filename, fmt('getNeighbor(%s, %s)', cell.getPosition().toString(), DIRS[dir]), 'Getting neighboring cell.');

        // find coordinates of the cell in the given direction
        if (dir < DIRS.EAST) row = dir == DIRS.NORTH ? row - 1 : row + 1;
        if (dir > DIRS.SOUTH) col = dir == DIRS.EAST ? col + 1 : col - 1;

        // let's throw a warning if an invalid neighbor is returned since we might want to change this some day
        if (row < 0 || row >= this.cells.length || col < 0 || col >= this.cells[0].length) {
            log.trace(__filename, fmt('getNeighbor(%s, %s)', cell.getPosition().toString(), DIRS[dir]), fmt('Invalid neighbor position: %d,%d', row, col));
        } else {
            log.trace(__filename, fmt('getNeighbor(%s, %s)', cell.getPosition().toString(), DIRS[dir]), fmt('Neighbor: %d,%d', row, col));
        }

        return this.getCell(new Position(row, col));
    }

    /**
     * Generates a new maze based on the given parameters
     * @param height - The height of the maze grid
     * @param width - The width of the maze grid
     * @param seed - pseudo random number generator seed value.  If empty, maze will be random and unrepeatable
     * @param challengeLevel - The difficulty level of the maze being generated
     */
    public generate(height: number, width: number, seed: string, challengeLevel: number): this {
        this.challenge = challengeLevel;

        if (this.cells.length > 0) {
            log.warn(__filename, 'generate()', 'This maze has already been generated.');
            return this;
        }

        log.info(__filename, 'generate()', fmt('Generating new %d (height) x %d (width) maze with seed "%s"', height, width, seed));
        startGenTime = Date.now();

        // validate height and width and collect errors
        let errors = new Array<string>();
        if (isNaN(height)) errors.push('Height must be numeric.\n\r');
        if (isNaN(width)) errors.push('Width must be numeric.\n\r');

        // set the dimensions
        this.height = height;
        this.width = width;

        if (this.height < MAZE_MIN_DIMENSION_SIZE || this.width < MAZE_MIN_DIMENSION_SIZE) {
            errors.push(
                fmt(
                    'Minimum maze dimensions (%dx%d) not met.  Please increase Height and/or Width and try again.\n\r',
                    MAZE_MIN_DIMENSION_SIZE,
                    MAZE_MIN_DIMENSION_SIZE
                )
            );
        }

        // check for size constraint
        if (height * width > MAZE_MAX_CELL_COUNT) {
            errors.push(
                fmt(
                    'Max cell count (%d) exceeded.  %d*%d=%d - Please reduce Height and/or Width and try again.',
                    MAZE_MAX_CELL_COUNT,
                    height,
                    width,
                    height * width
                )
            );
        }

        if (errors.toString().length > 0) {
            let error: Error = new Error(errors.toString());
            log.error(__filename, 'generate()', 'Errors detected.', error);
            throw error;
        }

        // implement random seed
        if (seed && seed.length > 0) {
            this.seed = seed;
            seedrandom(seed, { global: true });
        } else {
            log.warn(__filename, 'generate()', 'No seed value found.  This maze will be random.');
        }

        // set maze's ID
        this.id = fmt('%d:%d:%d:%s', this.height, this.width, this.challenge, this.seed);

        // build the empty cells array
        this.cells = new Array(height);
        for (let row: number = 0; row < height; row++) {
            let cols: Array<Cell> = new Array();
            for (let col: number = 0; col < width; col++) {
                let cell: Cell = new Cell();
                cell.setPosition(new Position(row, col));
                log.trace(__filename, 'buildCellsArray()', fmt('Adding cell in position [%d, %d]', row, col));
                cols.push(cell);
            }
            this.cells[row] = cols;
        }

        log.debug(__filename, 'generate()', fmt('Generated grid of %d empty cells.', height * width));

        // randomize start and finish locations
        let startCol: number = Math.floor(Math.random() * width);
        let finishCol: number = Math.floor(Math.random() * width);

        log.debug(__filename, 'generate()', fmt('Adding START ([%d, %d]) and FINISH ([%d, %d]) cells.', 0, startCol, height - 1, finishCol));

        // tag start and finish columns (start / finish tags force matching exits on edge)
        this.startCell = new Position(0, startCol);
        this.cells[0][startCol].addTag(CELL_TAGS.START);
        this.cells[0][startCol].addTag(CELL_TAGS.CARVED);
        this.finishCell = new Position(height - 1, finishCol);
        this.cells[height - 1][finishCol].addTag(CELL_TAGS.FINISH);

        // start the carving routine
        log.debug(__filename, 'generate()', 'Starting carvePassage() from Start Cell: ' + this.startCell.toString());
        this.carvePassage(this.getCell(this.startCell));
        log.debug(__filename, 'generate()', 'carvePassage() complete.');

        // now solve the maze and tag the path
        recurseDepth = 0;
        log.debug(__filename, 'generate()', 'Starting solveAndTag() from Start Cell: ' + this.startCell.toString());
        this.solveAndTag();
        log.debug(__filename, 'generate()', fmt('Solution complete, shortest path is %d steps.', this.ShortestPathLength));

        // then add some traps...
        if (this.challenge >= MAZE_TRAPS_MIN_CL) {
            this.addTraps();
        } else {
            log.debug(
                __filename,
                'generate()',
                fmt(
                    'Maze Challenge Level [%d] is below the trap threshold [%d] set by MIN_TRAPS_CHALLENGE_LEVEL, skipping addTraps().',
                    this.challenge,
                    MAZE_TRAPS_MIN_CL
                )
            );
        }

        // render the maze so the text rendering is set
        this.generateTextRender(true);

        log.info(
            __filename,
            'generate()',
            fmt(
                'Maze generation completed.' +
                    '\r\nMaze Details:  \r\n' +
                    '------------\r\n' +
                    'ID = %s\r\n' +
                    'Seed = %s\r\n' +
                    'Rows = %d\r\n' +
                    'Challenge Level = %d\r\n' +
                    'Columns = %d\r\n' +
                    'Generation Time = %dms\r\n' +
                    'Max Recursion = %d\r\n' +
                    'Cell Count = %d\r\n' +
                    'Trap Count = %d\r\n' +
                    'Shortest Path = %d\r\n' +
                    'Text Render:\r\n\r\n%s',
                this.id,
                this.seed == '' ? '<<NO SEED>> - Maze is random.' : this.seed,
                this.cells.length,
                this.cells[0].length,
                this.ChallengeLevel,
                Date.now() - startGenTime,
                maxRecurseDepth,
                this.CellCount,
                this.TrapCount,
                this.ShortestPathLength,
                this.TextRender
            )
        );
        return this;
    }

    /**
     * Carves passages out of a new maze grid that has no exits set
     * Only trace logging in here due to recursive log spam
     * @param cell
     */
    private carvePassage(cell: Cell) {
        recurseDepth++;
        if (recurseDepth > maxRecurseDepth) maxRecurseDepth = recurseDepth; // track deepest level of recursion during generation

        log.trace(__filename, 'carvePassage()', fmt('R%d Carving STARTED from [%s].', recurseDepth, cell.getPosition().toString()));

        // randomly sort an array of bitwise directional values (see also: Enums.DIRS)
        let dirs = [1, 2, 4, 8].sort(function(a, b) {
            return 0.5 - Math.random();
        });

        // wander through the grid using randomized directions provided in dirs[],
        // carving out cells by adding exits as we go
        for (let n: number = 0; n < dirs.length; n++) {
            let nextRow: number = cell.getPosition().row;
            let nextCol: number = cell.getPosition().col;

            // move location of next cell in the random direction
            if (dirs[n] > DIRS.SOUTH) {
                nextCol = dirs[n] == DIRS.EAST ? nextCol + 1 : nextCol - 1;
            } else {
                nextRow = dirs[n] == DIRS.NORTH ? nextRow - 1 : nextRow + 1;
            }

            try {
                // if the next call has valid grid coordinates, get it and try to carve into it
                if (nextRow >= 0 && nextRow < this.cells.length && nextCol >= 0 && nextCol < this.cells[0].length) {
                    log.trace(__filename, 'carvePassage()', fmt('R%d Next step, %s to [%s, %s].', recurseDepth, DIRS[dirs[n]], nextRow, nextCol));
                    let nextCell: Cell = this.cells[nextRow][nextCol];

                    if (!(nextCell.getTags() & CELL_TAGS.CARVED)) {
                        // if (!(nextCell.getTags() & CELL_TAGS.CARVED) && !(cell.getExits() & dirs[n])) {
                        // attempt to add an exit into the next room

                        if (cell.addExit(dirs[n], this.cells)) {
                            // this is a good move, so mark the cell as carved and enter it to continue carving
                            nextCell.addTag(CELL_TAGS.CARVED);
                            this.carvePassage(nextCell);
                        } else {
                            log.trace(
                                __filename,
                                'carvePassage()',
                                fmt(
                                    'R%d Skipping step %s - exit already set from [%s] to [%d, %d].',
                                    recurseDepth,
                                    DIRS[dirs[n]],
                                    cell.getPosition().toString(),
                                    nextRow,
                                    nextCol
                                )
                            );
                        }
                    } else {
                        log.trace(
                            __filename,
                            'carvePassage()',
                            fmt(
                                'R%d Cell to the %s is already carved, skipping step from [%s] to [%d, %d].',
                                recurseDepth,
                                DIRS[dirs[n]],
                                cell.getPosition().toString(),
                                nextRow,
                                nextCol
                            )
                        );
                    }
                } else {
                    log.trace(
                        __filename,
                        'carvePassage()',
                        fmt(
                            'R%d Invalid direction, skipping step %s from [%s] to [%d, %d].',
                            recurseDepth,
                            DIRS[dirs[n]],
                            cell.getPosition().toString(),
                            nextRow,
                            nextCol
                        )
                    );
                }
            } catch (error) {
                // somehow still grabbed an invalid cell
                log.error(__filename, 'carvePassage()', fmt('Error getting cell [%d, %d].', nextRow, nextCol), error);
            }
        }

        // exiting the function relieves one level of recursion
        recurseDepth--;
        log.trace(
            __filename,
            'carvePassage()',
            fmt('Max R%d Carve COMPLETED for cell [%d, %d].', recurseDepth, cell.getPosition().row, cell.getPosition().col)
        );
    }

    /**
     * Returns a text rendering of the maze as a grid of 3x3
     * character blocks.
     */
    public generateTextRender(forceRegen: boolean, playerPos?: Position) {
        const H_WALL = '+---';
        const S_DOOR = '+ S ';
        const F_DOOR = '+ F ';
        const V_WALL = '|';
        const H_DOOR = '+   ';
        const V_DOOR = ' ';
        const CENTER = '   ';
        const SOLUTION = ' . ';
        const ROW_END = '+';
        const AVATAR_TRAPPED = '>@<';
        const AVATAR = ' @ ';

        // TODO: Turn back on render caching after solver work is completed
        if (this.textRender.length > 0 && !forceRegen) {
            return this.textRender;
        }

        let textMaze = '';

        // walk the array, one row at a time
        for (let y = 0; y < this.height; y++) {
            for (let subRow = 0; subRow < 3; subRow++) {
                let row = '';

                // each text-cell is actually three
                for (let x = 0; x < this.width; x++) {
                    let cell: Cell = this.cells[y][x];
                    switch (subRow) {
                        case 0:
                            // only render north walls on first row
                            if (y == 0) {
                                if (!!(cell.getTags() & CELL_TAGS.START)) {
                                    row += S_DOOR;
                                } else {
                                    row += !!(cell.getExits() & DIRS.NORTH) ? H_DOOR : H_WALL;
                                }
                            }
                            break;
                        case 1:
                            // only render west walls on first column
                            if (x == 0) {
                                row += !!(cell.getExits() & DIRS.WEST) ? V_DOOR : V_WALL;
                            }

                            // render room center - check for cell properties and render appropriately
                            let cellFill = CENTER;
                            let tags = cell.getTags();
                            let traps = cell.getTraps();
                            if (playerPos !== undefined && this.cells[y][x].getPosition().equals(playerPos)) {
                                if (traps != 0) {
                                    cellFill = AVATAR_TRAPPED;
                                } else {
                                    cellFill = AVATAR;
                                }
                            }
                            if (!!(tags & CELL_TAGS.PATH)) cellFill = SOLUTION;
                            if (!!(traps & CELL_TRAPS.BEARTRAP)) cellFill = '>b<';
                            if (!!(traps & CELL_TRAPS.PIT)) cellFill = '>p<';
                            if (!!(traps & CELL_TRAPS.FLAMETHOWER)) cellFill = '>f<';
                            if (!!(traps & CELL_TRAPS.TARPIT)) cellFill = '>t<';
                            row += cellFill;

                            // always render east walls (with room center)
                            row += !!(cell.getExits() & DIRS.EAST) ? V_DOOR : V_WALL;

                            break;
                        case 2:
                            // always render south walls
                            if (!!(cell.getTags() & CELL_TAGS.FINISH)) {
                                row += F_DOOR;
                            } else {
                                row += !!(cell.getExits() & DIRS.SOUTH) ? H_DOOR : H_WALL;
                            }
                            break;
                    }
                }

                if (subRow != 1) {
                    row += ROW_END;
                }

                // end the line - only draw the top subRow if on the first line
                if ((subRow == 0 && y == 0) || subRow > 0) {
                    textMaze += row + '\n';
                }
            }
        }

        this.textRender = textMaze.toString();
        return textMaze;
    }

    /**
     * Wraps the recursive tagSolution function
     * and initializes tracking variables
     */
    public solveAndTag() {
        playerPos = this.startCell;
        solutionPath = new Array<string>();
        this.tagSolution(playerPos, 0);
    }

    /**
     * Solves the maze and tags the solution path TAGS.PATH.
     * Only using trace logging in here because it's recursive and very noisy...
     *
     * @param cellPos
     * @param pathId
     */
    private tagSolution(cellPos: Position, pathId: number) {
        recurseDepth++;
        if (recurseDepth > maxRecurseDepth) maxRecurseDepth = recurseDepth; // track deepest level of recursion during generation
        let cell: Cell;

        log.trace(__filename, fmt('tagSolution(%s)', cellPos.toString()), fmt('R:%d P:%s -> Solve pass started.', recurseDepth, pathId));

        // Attempt to get the cell - if it errors we can return from this call
        try {
            cell = this.getCell(cellPos);
        } catch (err) {
            log.warn(__filename, fmt('tagSolution(%s)', cellPos.toString()), fmt('R:%d P:%s -> Invalid cell - solve pass ended.', recurseDepth, pathId));
            recurseDepth--;
            return;
        }

        // add the cell to the list of explored cells
        solutionPath.push(cell.getPosition().toString());

        // helpful vars
        let dirs = [DIRS.NORTH, DIRS.SOUTH, DIRS.EAST, DIRS.WEST];
        let moveMade = false;

        if (playerPos.equals(this.finishCell)) {
            log.trace(__filename, fmt('tagSolution(%s)', cellPos.toString()), fmt('R:%d P:%s -> Solution found!', recurseDepth, pathId));
        } else {
            // update player location (global var), but don't move it once it finds the finish
            playerPos.row = cell.getPosition().row;
            playerPos.col = cell.getPosition().col;

            // loop through all directions until a valid move is found
            dirs.forEach(dir => {
                let cLoc: Position = cell.getPosition(); // current position
                let nLoc: Position = new Position(cLoc.row, cLoc.col); // next position

                switch (dir) {
                    case DIRS.NORTH:
                        // start always has an exit on the north wall, but it's not usable
                        if (!!(cell.getExits() & DIRS.NORTH) && !(cell.getTags() & CELL_TAGS.START)) nLoc.row -= 1;
                        break;
                    case DIRS.SOUTH:
                        // finish always has an exit on the south wall, but it's not usable either
                        if (!!(cell.getExits() & DIRS.SOUTH) && !(cell.getTags() & CELL_TAGS.FINISH)) nLoc.row += 1;
                        break;
                    case DIRS.EAST:
                        if (!!(cell.getExits() & DIRS.EAST)) nLoc.col += 1;
                        break;
                    case DIRS.WEST:
                        if (!!(cell.getExits() & DIRS.WEST)) nLoc.col -= 1;
                        break;
                }

                // ensure that a move is being made, that the cell is not visited, and that we aren't already at the finish
                if (!nLoc.equals(cLoc) && solutionPath.indexOf(nLoc.toString()) < 0) {
                    // update the path ID if moving into a new branch
                    if (moveMade) {
                        pathId++;
                        log.trace(
                            __filename,
                            fmt('tagSolution(%s)', cellPos.toString()),
                            fmt('R:%d P:%s -- Moving %s [NEW PATH] to cell %s.', recurseDepth, pathId, DIRS[dir], nLoc.toString())
                        );
                    } else {
                        log.trace(
                            __filename,
                            fmt('tagSolution(%s)', cellPos.toString()),
                            fmt('R:%d P:%s -- Moving %s [CONTINUING PATH] to cell %s.', recurseDepth, pathId, DIRS[dir], nLoc.toString())
                        );
                    }

                    if (!playerPos.equals(this.finishCell)) this.tagSolution(nLoc, pathId);

                    // mark that a move was made
                    moveMade = true;
                }
            });

            if (!moveMade) {
                log.trace(
                    __filename,
                    fmt('tagSolution(%s)', cellPos.toString()),
                    fmt('R:%d P:%s -- [DEAD END] Cannot move from cell %s', recurseDepth, pathId, cell.getPosition().toString())
                );
            }
        }

        if (playerPos.equals(this.finishCell)) {
            log.trace(
                __filename,
                fmt('tagSolution(%s)', cellPos.toString()),
                fmt('R:%d P:%s -- Adding [PATH] tag to %s.', recurseDepth, pathId, cell.getPosition().toString())
            );
            this.shortestPathLength++;

            // clear existing tags and add the path tag - traps come later
            cell.addTag(CELL_TAGS.PATH);
        }

        recurseDepth--;
        log.trace(__filename, fmt('tagSolution(%s)', cellPos.toString()), fmt('R:%d P:%s -- Path complete.', recurseDepth, pathId));
    } // end tagSolution()

    // test if cell has a trap
    private hasTrap(cell: Cell): boolean {
        let traps = cell.getTraps();
        if (!!(traps & CELL_TRAPS.BEARTRAP)) return true;
        if (!!(traps & CELL_TRAPS.PIT)) return true;
        if (!!(traps & CELL_TRAPS.FLAMETHOWER)) return true;
        if (!!(traps & CELL_TRAPS.TARPIT)) return true;
        return false;
    }

    /**
     * Adds traps to the maze. Trap frequency and positioning changes based on maze challenge level.
     */
    private addTraps() {
        let fnName = 'addTraps()';
        let trapCount = 0;

        log.debug(__filename, fnName, fmt('Generating traps for challenge level %s maze.', this.challenge));

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // made it this far - let's set some traps!
                let trapChance = 100 - this.challenge * 10;
                let trapRoll = Math.floor(Math.random() * 100);
                let cell = this.cells[y][x];

                if (trapRoll < trapChance) {
                    log.trace(__filename, fnName, 'Trap Roll Failed (' + trapRoll + ' < ' + trapChance + '), no traps here :(');
                    continue;
                }

                log.trace(__filename, fnName, 'Trap Roll Passed (' + trapRoll + ' >= ' + trapChance + '), time to set some traps! >:)');

                // traps only allowed if there are open cells on either side to allow jumping
                let exits = cell.getExits();
                let tags = cell.getTags();

                // bail out if we already have a trap here
                if (cell.getTraps() != CELL_TRAPS.NONE) {
                    log.trace(__filename, fnName, fmt('Invalid trap location (Already Trapped): ', cell.getPosition().toString()));
                    continue;
                }

                // no traps in start cell
                if (!!(tags & CELL_TAGS.START)) {
                    log.trace(__filename, fnName, fmt('Invalid trap location (Start Cell): ', cell.getPosition().toString()));
                    continue;
                }

                // no traps in finish cell
                // TODO: Allow traps if there's a way to jump them?
                if (!!(tags & CELL_TAGS.FINISH)) {
                    log.trace(__filename, fnName, fmt('Invalid trap location (Finish Cell): ', cell.getPosition().toString()));
                    continue;
                }

                // traps may only occur in locations where the player can jump over them
                // TODO: Rule may change if other ways to avoid traps (potions, items, secret doors, etc.) are added
                if (!((!!(exits & DIRS.NORTH) && !!(exits & DIRS.SOUTH)) || (!!(exits & DIRS.EAST) && !!(exits & DIRS.WEST)))) {
                    log.trace(__filename, fnName, fmt('Invalid trap location (Unavoidable): ', cell.getPosition().toString()));
                    continue;
                }

                // Traps on solution path have extra rules:
                //   1) Must obey challenge level
                //   2) Must not be placed on path along maze edges (to avoid blocking path to exit)
                if (!!(tags & CELL_TAGS.PATH)) {
                    // enforce challenge level settings
                    if (this.challenge < MAZE_TRAPS_ON_PATH_MIN_CL) {
                        log.debug(
                            __filename,
                            fnName,
                            fmt('Invalid trap location (No Traps on Path at CL ' + this.challenge + '): ', cell.getPosition().toString())
                        );
                        continue;
                    }

                    // avoid blocking solution path along edges
                    if (
                        cell.getPosition().col == this.width - 1 ||
                        cell.getPosition().col == 0 ||
                        (cell.getPosition().row == this.height - 1 || cell.getPosition().row == 0)
                    ) {
                        // and avoid T-Junctions, but allow dead-ends (four-way junctions not possible on edge)
                        if (cell.getExitCount() > 2) {
                            log.trace(__filename, fnName, fmt('Invalid trap location (On Edge & On Path): ', cell.getPosition().toString()));
                            continue;
                        }
                    }
                }

                // don't double-up on traps - check north
                if (y > 0 && !!(exits & DIRS.NORTH) && this.hasTrap(this.getNeighbor(cell, DIRS.NORTH))) {
                    log.trace(__filename, fnName, fmt('Invalid trap location (Adjacent Trap - North): ', cell.getPosition().toString()));
                    continue;
                }

                // don't double-up on traps - check south
                if (y < this.height - 1 && !!(exits & DIRS.SOUTH) && this.hasTrap(this.getNeighbor(cell, DIRS.SOUTH))) {
                    log.trace(__filename, fnName, fmt('Invalid trap location (Adjacent Trap - South): ', cell.getPosition().toString()));
                    continue;
                }

                // don't double-up on traps - check east
                if (x < this.width - 1 && !!(exits & DIRS.EAST) && this.hasTrap(this.getNeighbor(cell, DIRS.EAST))) {
                    log.trace(__filename, fnName, fmt('Invalid trap location (Adjacent Trap - East): ', cell.getPosition().toString()));
                    continue;
                }

                // don't double-up on traps - check east
                if (x > 0 && !!(exits & DIRS.WEST) && this.hasTrap(this.getNeighbor(cell, DIRS.WEST))) {
                    log.trace(__filename, fnName, fmt('Invalid trap location (Adjacent Trap - West): ', cell.getPosition().toString()));
                    continue;
                }

                // randomly select which trap to lay
                let trapNum = Math.floor(Math.random() * (Object.keys(CELL_TRAPS).length / 2));
                log.trace(__filename, fnName, 'Setting trap #' + trapNum + ' in cell ' + cell.getPosition().toString());
                switch (trapNum) {
                    case 0: {
                        // zero means NONE.  Boo :(
                        break;
                    }
                    case 1: {
                        cell.setTrap(CELL_TRAPS.PIT);
                        trapCount++;
                        break;
                    }
                    case 2: {
                        cell.setTrap(CELL_TRAPS.FLAMETHOWER);
                        trapCount++;
                        break;
                    }
                    case 3: {
                        cell.setTrap(CELL_TRAPS.BEARTRAP);
                        trapCount++;
                        break;
                    }
                    case 4: {
                        cell.setTrap(CELL_TRAPS.TARPIT);
                        trapCount++;
                        break;
                    }
                    default: {
                        log.trace(__filename, fnName, fmt('Invalid trap number: %s', trapNum));
                    }
                }
            }
        }
        this.trapCount = trapCount;
        log.debug(__filename, fnName, fmt('addTraps() complete. Trap count: %d (%d%)', trapCount, Math.round((trapCount / (this.height * this.width)) * 100)));
    }

    public get Height(): number {
        return this.height;
    }
    public get Width(): number {
        return this.width;
    }
    public get Seed(): string {
        return this.seed;
    }
    public get ChallengeLevel(): number {
        return this.challenge;
    }
    public get Cells(): Array<Array<Cell>> {
        return this.cells;
    }
    public get CellCount(): number {
        return this.cells.length * this.cells[0].length;
    }
    public get TextRender(): string {
        return this.textRender;
    }
    public get Id(): string {
        return this.id;
    }
    public get StartCell(): Position {
        return this.startCell;
    }
    public get FinishCell(): Position {
        return this.finishCell;
    }
    public get ShortestPathLength(): number {
        return this.shortestPathLength;
    }
    public get TrapCount(): number {
        return this.trapCount;
    }
    public get Note(): string {
        return this.note;
    }
    public set Note(value: string) {
        this.note = value;
    }
    public MinHeight(): number {
        return MAZE_MIN_DIMENSION_SIZE;
    }
    public MinWidth(): number {
        return MAZE_MIN_DIMENSION_SIZE;
    }
    public MaxCellCount(): number {
        return MAZE_MAX_CELL_COUNT;
    }
}

export default Maze;
