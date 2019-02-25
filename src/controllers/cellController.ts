import {format as fmt} from 'util';
import {Cell} from '../models/Cell';
import {DIRS, FN_MODES, CELL_TAGS, CELL_TRAPS} from '../Enums';
import * as Helpers from '../Helpers';
import {Logger} from '@mazemasterjs/logger';
import {Location} from '../Location';

const log: Logger = Logger.getInstance();

export class cellController extends Cell {
    constructor(data?: Cell) {
        super(data);
    }

    /**
     * Increment the visits count of the cell and
     * capture the cell's last visit move number
     *
     * @param moveNumber
     */
    addVisit(moveNumber: number) {
        super.Visits = super.Visits++;
        super.LastVisitMoveNum = moveNumber;
    }

    /**
     * Count and return the number of exits in this cell
     * by checking the exits bitwise against possible direction
     * enumeration values
     */
    public ExitCount(): number {
        if (super.Exits == 0) {
            return 0;
        } else {
            let exitCount = 0;

            // start from 1 - we don't want to count "DIRS.NONE" (zero)
            for (let x = 1; x < Object.keys.length / 2; x++) {
                if (!!(super.Exits && DIRS[x])) exitCount++;
            }
            return exitCount;
        }
    }

    public listExits(): string {
        return Helpers.listSelectedBitNames(DIRS, super.Exits);
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
            fmt('addExit(%s)', DIRS[dir]),
            fmt('Calling setExit(ADD, %s) from [%s]. Existing exits: %s.', DIRS[dir], super.Location.toString(), this.listExits())
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
            fmt('removeExit(%s)', DIRS[dir]),
            fmt('Calling setExit(REMOVE, %s) from [%s]. Existing exits: %s.', DIRS[dir], super.Location.toString(), this.listExits())
        );
        return this.setExit(FN_MODES.REMOVE, dir, cells);
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
            fmt('setExit(%s, %s)', modeName, dirName),
            fmt('Setting exits in [%s]. Existing exits: %s.', super.Location.toString(), this.listExits())
        );

        if (mode == FN_MODES.ADD ? !(super.Exits & dir) : !!(super.Exits & dir)) {
            let nPos = new Location(-1, -1); // locate an adjoining cell - must open exit on both sides

            switch (dir) {
                case DIRS.NORTH:
                    validMove = super.Location.row > 0;
                    if (validMove) nPos = new Location(super.Location.row - 1, super.Location.col);
                    break;
                case DIRS.SOUTH:
                    validMove = super.Location.row < cells.length;
                    if (validMove) nPos = new Location(super.Location.row + 1, super.Location.col);
                    break;
                case DIRS.EAST:
                    validMove = super.Location.col < cells[0].length;
                    if (validMove) nPos = new Location(super.Location.row, super.Location.col + 1);
                    break;
                case DIRS.WEST:
                    validMove = super.Location.col > 0;
                    if (validMove) nPos = new Location(super.Location.row, super.Location.col - 1);
                    break;
            }

            if (validMove) {
                log.trace(__filename, 'setExit()', fmt('Valid direction, setting exit from [%s] into [%d, %d]', super.Location.toString(), nPos.row, nPos.col));
                super.Exits = mode == FN_MODES.ADD ? (super.Exits += dir) : (super.Exits -= dir);
                let neighbor: cellController = new cellController(cells[nPos.row][nPos.col]);

                log.trace(
                    __filename,
                    fmt('setExit(%s, %s)', modeName, dirName),
                    fmt('Exits set in cell [%d, %d]. Exits: ', super.Location.row, super.Location.col, this.listExits())
                );

                neighbor.Exits = mode == FN_MODES.ADD ? (neighbor.Exits += Helpers.reverseDir(dir)) : (neighbor.Exits -= dir);
                log.trace(
                    __filename,
                    fmt('setExit(%s, %s)', modeName, dirName),
                    fmt(
                        'Reverse exit (%s -> %s) set in adjoining cell [%d, %d]. Exits: %s, Tags: %s',
                        dirName,
                        DIRS[Helpers.reverseDir(dir)],
                        neighbor.Location.row,
                        neighbor.Location.col,
                        neighbor.listExits(),
                        neighbor.listTags()
                    )
                );
            } else {
                log.warn(__filename, fmt('setExit(%s, %s)', modeName, dirName), fmt('Invalid adjoining cell location: [%d, %d]', nPos.row, nPos.col));
            }
        } else {
            log.warn(
                __filename,
                fmt('setExit(%s, %s)', modeName, dirName),
                fmt(
                    'Invalid action in cell [%d, %d]. Exit %s. Cell exits: %s',
                    super.Location.row,
                    super.Location.col,
                    mode == FN_MODES.ADD ? 'already exists' : 'not found',
                    this.listExits()
                )
            );
        }

        return validMove;
    } // setExit

    // checks for an open direction
    public isDirOpen(dir: DIRS): boolean {
        return !!(super.Exits & dir);
    }
    /**
     * Returns list of string values representing cell tags
     */
    public listTags(): string {
        return Helpers.listSelectedBitNames(CELL_TAGS, super.Tags);
    }

    /**
     * Adds an Enums.Tag to this cell if it doesn't already exist
     * @param tag
     */
    public addTag(tag: CELL_TAGS) {
        let tagName = CELL_TAGS[tag];

        if (!(super.Tags & tag)) {
            super.Tags += tag;

            switch (tag) {
                case CELL_TAGS.START:
                    // force north exit on start cell - do not use addExit() for this!
                    if (!(super.Exits & DIRS.NORTH)) {
                        log.trace(
                            __filename,
                            'addTag(' + tagName + ')',
                            fmt(
                                '[%d, %d] has %s tag. Forcing NORTH exit through edge. Cell exits: %s',
                                super.Location.row,
                                super.Location.col,
                                tagName,
                                this.listExits()
                            )
                        );
                        super.Exits += DIRS.NORTH;
                    }
                    break;
                case CELL_TAGS.FINISH:
                    // force south exit on finish cell - do not use addExit() for this!
                    if (!(super.Exits & DIRS.SOUTH)) {
                        log.trace(
                            __filename,
                            'addTag(' + tagName + ')',
                            fmt(
                                '[%d, %d] has %s tag. Forcing SOUTH exit through edge. Cell exits: %s',
                                super.Location.row,
                                super.Location.col,
                                tagName,
                                this.listExits()
                            )
                        );
                        super.Exits += DIRS.SOUTH;
                    }
                    break;
            }
            log.trace(
                __filename,
                'addTag(' + tagName + ')',
                fmt('Tag %s added to cell [%d, %d]. Current tags: %s.', tagName, super.Location.row, super.Location.col, this.listTags())
            );
        } else {
            log.warn(
                __filename,
                'addTag(' + tagName + ')',
                fmt('Tag %s already exists in cell [%d, %d]. Current tags: %s.', tagName, super.Location.row, super.Location.col, this.listTags())
            );
        }
    }

    /**
     * Removes a tag from this cell, if it exists
     * @param tag
     */
    public removeTag(tag: CELL_TAGS) {
        let tagName = CELL_TAGS[tag];
        if (!!(super.Tags & tag)) {
            super.Tags -= tag;
            log.debug(
                __filename,
                'removeTag(' + tagName + ')',
                fmt('Tag %s removed from cell [%d, %d]. Current tags: %s.', tagName, super.Location.row, super.Location.col, this.listTags())
            );
        } else {
            log.warn(
                __filename,
                'removeTag(' + tagName + ')',
                fmt('Tag %s not found in cell [%d, %d]. Current tags: %s.', tagName, super.Location.row, super.Location.col, this.listTags())
            );
        }
    }
}
export default cellController;
