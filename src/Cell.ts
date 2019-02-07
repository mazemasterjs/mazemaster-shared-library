import { format, format as fmt } from 'util';
import * as Helpers from './Helpers';
import { CELL_TAGS, CELL_TRAPS, DIRS } from './Enums';
import { Logger, LOG_LEVELS } from './Logger';
import { Position } from './Position';

/**
 * Used to determine mode of functions modifying cell exits
 */
enum FN_MODES {
    ADD = 0,
    REMOVE
}

let log = Logger.getInstance();
log.setLogLevel(LOG_LEVELS.TRACE);

/**
 * Represents a single cell in a maze
 */
export class Cell {
    private pos: Position;
    private exits: number;
    private tags: number;
    private traps: number;
    private visits: number;
    private lastVisit: number;
    private notes: Array<string>;

    constructor(data?: Cell) {
        if (data !== undefined) {
            this.pos = data.pos;
            this.exits = data.exits;
            this.tags = data.tags;
            this.traps = data.traps;
            this.visits = data.visits;
            this.lastVisit = data.lastVisit;
            this.notes = data.notes;
        } else {
            this.pos = new Position(0, 0);
            this.exits = DIRS.NONE;
            this.tags = CELL_TAGS.NONE;
            this.traps = CELL_TRAPS.NONE;
            this.visits = 0;
            this.lastVisit = 0;
            this.notes = new Array<string>();
        }
    }

    public addNote(note: string) {
        this.notes.push(note);
        log.debug(__filename, 'addNote()', 'Note added to cell: ' + note);
    }

    public getNotes(): string[] {
        return this.notes;
    }

    public addVisit(moveNumber: number) {
        this.visits++;
        this.lastVisit = moveNumber;
    }

    public getVisitCount(): number {
        return this.visits;
    }

    public getLastVisitMoveNum(): number {
        return this.lastVisit;
    }

    public getExits(): number {
        return this.exits;
    }

    public getExitCount(): number {
        return Helpers.getSelectedBitNames(DIRS, this.exits).length;
    }

    public listExits(): string {
        return Helpers.listSelectedBitNames(DIRS, this.exits);
    }

    /**
     * Adds exit to a cell if exit doesn't already exist.
     * Also adds neighboring exit to valid, adjoining cell.
     *
     * @param dir
     * @param cells
     * @returns boolean
     */
    public addExit(dir: DIRS, cells: Array<Array<Cell>>): boolean {
        return this.setExit(FN_MODES.ADD, dir, cells);
    }

    /**
     * Adds exit to a cell if exit doesn't already exist.
     * Also adds neighboring exit to valid, adjoining cell.
     *
     * @param dir
     * @param cells
     * @returns boolean
     */
    public removeExit(dir: DIRS, cells: Array<Array<Cell>>): boolean {
        return this.setExit(FN_MODES.REMOVE, dir, cells);
    }

    /**
     * Returns the opposing direction for a given direction
     * @param dir
     */
    private reverseDir(dir: DIRS): number {
        switch (dir) {
            case DIRS.NORTH:
                return DIRS.SOUTH;
            case DIRS.SOUTH:
                return DIRS.NORTH;
            case DIRS.EAST:
                return DIRS.WEST;
            case DIRS.WEST:
                return DIRS.EAST;
            default:
                return 0;
        }
    }

    /**
     * Adds or Removes cell exits, depending on SET_EXIT_MODES value.
     * Also adds or removes opposite exit from valid, adjoining cell.
     * Only trace logging - this is called frequently by recursive generation
     * routines.
     *
     * @param dir
     * @param cells
     * @returns boolean
     */
    private setExit(mode: FN_MODES, dir: DIRS, cells: Array<Array<Cell>>): boolean {
        let modeName = mode == FN_MODES.ADD ? 'ADD' : 'REMOVE';
        let dirName = DIRS[dir];
        let validMove = true; // only set to true if valid adjoining cell exits to open an exit to

        log.trace(
            __filename,
            format('setExit(%s, %s)', modeName, dirName),
            format('Setting exits in cell [C:%d][R:%d]. Existing exits: %s.', this.pos.col, this.pos.row, this.listExits())
        );

        if (mode == FN_MODES.ADD ? !(this.exits & dir) : !!(this.exits & dir)) {
            let nPos = new Position(-1, -1); // locate an adjoining cell - must open exit on both sides

            switch (dir) {
                case DIRS.NORTH:
                    validMove = this.pos.row > 0;
                    nPos = new Position(this.pos.col, this.pos.row - 1);
                    break;
                case DIRS.SOUTH:
                    validMove = this.pos.row < cells[0].length;
                    nPos = new Position(this.pos.col, this.pos.row + 1);
                    break;
                case DIRS.EAST:
                    validMove = this.pos.col < cells.length;
                    nPos = new Position(this.pos.col + 1, this.pos.row);
                    break;
                case DIRS.WEST:
                    validMove = this.pos.col > 0;
                    nPos = new Position(this.pos.col - 1, this.pos.row);
                    break;
            }

            if (validMove) {
                log.trace(__filename, 'setExit()', format('Valid direction, setting exit in cell [C:%d][R:%d]', nPos.col, nPos.row));
                log.trace(__filename, 'setExit()', cells[nPos.col][nPos.row].getPosition().toString());
                let neighbor: Cell = cells[nPos.col][nPos.row];

                this.exits = mode == FN_MODES.ADD ? (this.exits += dir) : (this.exits -= dir);
                log.trace(
                    __filename,
                    format('setExit(%s, %s)', modeName, dirName),
                    format('Exits set in cell [C:%d][R:%d]. Exits: ', this.pos.col, this.pos.row, this.listExits())
                );

                neighbor.exits = mode == FN_MODES.ADD ? (neighbor.exits += this.reverseDir(dir)) : (neighbor.exits -= dir);
                log.trace(
                    __filename,
                    format('setExit(%s, %s)', modeName, dirName),
                    format('Adjoining exits set in cell [C:%d][R:%d]. Exits: ', neighbor.pos.row, neighbor.pos.col, neighbor.listExits())
                );
            } else {
                log.warn(__filename, format('setExit(%s, %s)', modeName, dirName), format('Invalid adjoining cell location: [C:%d][R:%d]', nPos.col, nPos.row));
            }
        } else {
            log.warn(
                __filename,
                format('setExit(%s, %s)', modeName, dirName),
                format(
                    'Invalid action in cell [C:%d][R:%d]. Exit %s. Cell exits: %s',
                    this.pos.row,
                    this.pos.col,
                    mode == FN_MODES.ADD ? 'already exists' : 'not found',
                    this.listExits()
                )
            );
        }

        return validMove;
    } // setExit

    /**
     * Returns an array representing the cells grid coordinates (y, x)
     */
    public getPosition(): Position {
        return new Position(this.pos.col, this.pos.row);
    }

    // checks for an open direction
    public isDirOpen(dir: DIRS): boolean {
        return !!(this.getExits() & dir);
    }

    /**
     * Set the cell's grid coordinates
     * @param x
     * @param y
     */
    public setPosition(pos: Position) {
        this.pos = pos;
    }

    /**
     * Returns the bitwise integer value representing cell tags
     */
    public getTags(): number {
        return this.tags;
    }

    /**
     * Returns the bitwise integer value representing cell traps
     */
    public getTraps(): number {
        return this.traps;
    }

    /**
     * Returns list of string values representing cell tags
     */
    public listTags(): string {
        return Helpers.listSelectedBitNames(CELL_TAGS, this.tags);
    }

    /**
     * Adds trap to this cell if no trap is already set
     * @param trap
     */
    public setTrap(trap: CELL_TRAPS) {
        let trapName = CELL_TRAPS[trap];
        if (this.traps == 0) {
            this.traps = trap;
            log.trace(__filename, 'setTrap(' + trapName + ')', format('Trap %s set on cell [C:%d][R:%d].', trapName, this.pos.col, this.pos.row));
        } else {
            log.warn(__filename, 'setTrap(' + trapName + ')', format('Trap (%s) already set on cell [C:%d][R:%d].', trapName, this.pos.col, this.pos.row));
        }
    }

    /**
     * Adds an Enums.Tag to this cell if it doesn't already exist
     * @param tag
     */
    public addTag(tag: CELL_TAGS) {
        let tagName = CELL_TAGS[tag];

        if (!(this.tags & tag)) {
            this.tags += tag;

            switch (tag) {
                case CELL_TAGS.START:
                    // force north exit on start cell - do not use addExit() for this!
                    if (!(this.exits & DIRS.NORTH)) {
                        log.trace(
                            __filename,
                            'addTag(' + tagName + ')',
                            format(
                                '[C:%d][R:%d] has %s tag. Forcing NORTH exit through edge. Cell exits: %s',
                                this.pos.col,
                                this.pos.row,
                                tagName,
                                this.listExits()
                            )
                        );
                        this.exits += DIRS.NORTH;
                    }
                    break;
                case CELL_TAGS.FINISH:
                    // force south exit on finish cell - do not use addExit() for this!
                    if (!(this.exits & DIRS.SOUTH)) {
                        log.trace(
                            __filename,
                            'addTag(' + tagName + ')',
                            format(
                                '[C:%d][R:%d] has %s tag. Forcing SOUTH exit through edge. Cell exits: %s',
                                this.pos.col,
                                this.pos.row,
                                tagName,
                                this.listExits()
                            )
                        );
                        this.exits += DIRS.SOUTH;
                    }
                    break;
            }
            log.trace(
                __filename,
                'addTag(' + tagName + ')',
                format('Tag %s added to cell [C:%d][R:%d]. Current tags: %s.', tagName, this.pos.col, this.pos.row, this.listTags())
            );
        } else {
            log.warn(
                __filename,
                'addTag(' + tagName + ')',
                format('Tag %s already exists in cell [C:%d][R:%d]. Current tags: %s.', tagName, this.pos.col, this.pos.row, this.listTags())
            );
        }
    }

    /**
     * Removes a tag from this cell, if it exists
     * @param tag
     */
    public removeTag(tag: CELL_TAGS) {
        let tagName = CELL_TAGS[tag];
        if (!!(this.tags & tag)) {
            this.tags -= tag;
            log.debug(
                __filename,
                'removeTag(' + tagName + ')',
                format('Tag %s removed from cell [C:%d][R:%d]. Current tags: %s.', tagName, this.pos.col, this.pos.row, this.listTags())
            );
        } else {
            log.warn(
                __filename,
                'removeTag(' + tagName + ')',
                format('Tag %s not found in cell [C:%d][R:%d]. Current tags: %s.', tagName, this.pos.col, this.pos.row, this.listTags())
            );
        }
    }
}

export default Cell;
