import {format, format as fmt} from 'util';
import * as Helpers from './Helpers';
import {CELL_TAGS, CELL_TRAPS, DIRS} from './Enums';
import {Logger} from '@mazemasterjs/logger';
import {Location} from './Location';

/**
 * Used to determine mode of functions modifying cell exits
 */
enum FN_MODES {
    ADD = 0,
    REMOVE
}

let log = Logger.getInstance();

/**
 * Represents a single cell in a maze
 */
export class Cell {
    private pos: Location;
    private exits: number;
    private tags: number;
    private trap: number;
    private visits: number;
    private lastVisit: number;
    private notes: Array<string>;

    constructor(data?: Cell) {
        if (data !== undefined) {
            this.pos = data.pos;
            this.exits = data.exits;
            this.tags = data.tags;
            this.trap = data.trap;
            this.visits = data.visits;
            this.lastVisit = data.lastVisit;
            this.notes = data.notes;
        } else {
            this.pos = new Location(0, 0);
            this.exits = DIRS.NONE;
            this.tags = CELL_TAGS.NONE;
            this.trap = CELL_TRAPS.NONE;
            this.visits = 0;
            this.lastVisit = 0;
            this.notes = new Array<string>();
        }
    }

    public addNote(note: string) {
        this.notes.push(note);
        log.debug(__filename, 'addNote()', 'Note added to cell: ' + note);
    }

    public Notes(): string[] {
        return this.notes;
    }

    public addVisit(moveNumber: number) {
        this.visits++;
        this.lastVisit = moveNumber;
    }

    public VisitCount(): number {
        return this.visits;
    }

    public LastVisitMoveNum(): number {
        return this.lastVisit;
    }

    public get Exits(): number {
        return this.exits;
    }

    public ExitCount(): number {
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
        log.trace(
            __filename,
            format('addExit(%s)', DIRS[dir]),
            format('Calling setExit(ADD, %s) from [%s]. Existing exits: %s.', DIRS[dir], this.pos.toString(), this.listExits())
        );
        return this.setExit(FN_MODES.ADD, dir, cells);
    }

    /**
     * Removes exit to a cell if it exists.
     * Also removes neighboring exit from valid, adjoining cell.
     *
     * @param dir
     * @param cells
     * @returns boolean
     */
    public removeExit(dir: DIRS, cells: Array<Array<Cell>>): boolean {
        log.trace(
            __filename,
            format('removeExit(%s)', DIRS[dir]),
            format('Calling setExit(REMOVE, %s) from [%s]. Existing exits: %s.', DIRS[dir], this.pos.toString(), this.listExits())
        );
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
            format('Setting exits in [%s]. Existing exits: %s.', this.pos.toString(), this.listExits())
        );

        if (mode == FN_MODES.ADD ? !(this.exits & dir) : !!(this.exits & dir)) {
            let nPos = new Location(-1, -1); // locate an adjoining cell - must open exit on both sides

            switch (dir) {
                case DIRS.NORTH:
                    validMove = this.pos.row > 0;
                    if (validMove) nPos = new Location(this.pos.row - 1, this.pos.col);
                    break;
                case DIRS.SOUTH:
                    validMove = this.pos.row < cells.length;
                    if (validMove) nPos = new Location(this.pos.row + 1, this.pos.col);
                    break;
                case DIRS.EAST:
                    validMove = this.pos.col < cells[0].length;
                    if (validMove) nPos = new Location(this.pos.row, this.pos.col + 1);
                    break;
                case DIRS.WEST:
                    validMove = this.pos.col > 0;
                    if (validMove) nPos = new Location(this.pos.row, this.pos.col - 1);
                    break;
            }

            if (validMove) {
                log.trace(
                    __filename,
                    'setExit()',
                    format('Valid direction, setting exit from [%s] into [%d, %d]', this.Location.toString(), nPos.row, nPos.col)
                );
                this.exits = mode == FN_MODES.ADD ? (this.exits += dir) : (this.exits -= dir);

                let neighbor: Cell = cells[nPos.row][nPos.col];

                log.trace(
                    __filename,
                    format('setExit(%s, %s)', modeName, dirName),
                    format('Exits set in cell [%d, %d]. Exits: ', this.pos.row, this.pos.col, this.listExits())
                );

                neighbor.exits = mode == FN_MODES.ADD ? (neighbor.exits += this.reverseDir(dir)) : (neighbor.exits -= dir);
                log.trace(
                    __filename,
                    format('setExit(%s, %s)', modeName, dirName),
                    format(
                        'Reverse exit (%s -> %s) set in adjoining cell [%d, %d]. Exits: %s, Tags: %s',
                        dirName,
                        DIRS[this.reverseDir(dir)],
                        neighbor.pos.row,
                        neighbor.pos.col,
                        neighbor.listExits(),
                        neighbor.listTags()
                    )
                );
            } else {
                log.warn(__filename, format('setExit(%s, %s)', modeName, dirName), format('Invalid adjoining cell location: [%d, %d]', nPos.row, nPos.col));
            }
        } else {
            log.warn(
                __filename,
                format('setExit(%s, %s)', modeName, dirName),
                format(
                    'Invalid action in cell [%d, %d]. Exit %s. Cell exits: %s',
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
    public get Location(): Location {
        return new Location(this.pos.row, this.pos.col);
    }

    /**
     * Set the cell's grid coordinates
     * @param x
     * @param y
     */
    public set Location(pos: Location) {
        this.pos = pos;
    }

    // checks for an open direction
    public isDirOpen(dir: DIRS): boolean {
        return !!(this.Exits & dir);
    }

    /**
     * Returns the bitwise integer value representing cell tags
     */
    public get Tags(): number {
        return this.tags;
    }

    /**
     * Set the cell's tags to the given value
     */
    public set Tags(tags: number) {
        this.tags = tags;
    }

    /**
     * Returns the bitwise integer value representing cell traps
     */
    public get Trap(): number {
        return this.trap;
    }

    /**
     * Sets the cell's traps to the given value
     * @param trap: 0 (none) or a value from ENUM.CELL_TRAPS
     */
    public set Trap(trap: number) {
        let trapName = CELL_TRAPS[trap];
        if (this.trap == 0) {
            this.trap = trap;
            log.trace(__filename, 'setTrap(' + trapName + ')', format('Trap %s set on cell [%d, %d].', trapName, this.pos.row, this.pos.col));
        } else {
            log.warn(__filename, 'setTrap(' + trapName + ')', format('Trap (%s) already set on cell [%d, %d].', trapName, this.pos.row, this.pos.col));
        }
    }

    /**
     * Returns list of string values representing cell tags
     */
    public listTags(): string {
        return Helpers.listSelectedBitNames(CELL_TAGS, this.tags);
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
                                '[%d, %d] has %s tag. Forcing NORTH exit through edge. Cell exits: %s',
                                this.pos.row,
                                this.pos.col,
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
                                '[%d, %d] has %s tag. Forcing SOUTH exit through edge. Cell exits: %s',
                                this.pos.row,
                                this.pos.col,
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
                format('Tag %s added to cell [%d, %d]. Current tags: %s.', tagName, this.pos.row, this.pos.col, this.listTags())
            );
        } else {
            log.warn(
                __filename,
                'addTag(' + tagName + ')',
                format('Tag %s already exists in cell [%d, %d]. Current tags: %s.', tagName, this.pos.row, this.pos.col, this.listTags())
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
                format('Tag %s removed from cell [%d, %d]. Current tags: %s.', tagName, this.pos.row, this.pos.col, this.listTags())
            );
        } else {
            log.warn(
                __filename,
                'removeTag(' + tagName + ')',
                format('Tag %s not found in cell [%d, %d]. Current tags: %s.', tagName, this.pos.row, this.pos.col, this.listTags())
            );
        }
    }
}

export default Cell;
