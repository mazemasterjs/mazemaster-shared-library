import {CELL_TAGS, CELL_TRAPS, DIRS} from '../Enums';
import {Logger} from '@mazemasterjs/logger';
import {Location} from '../Location';

let log = Logger.getInstance();

/**
 * Represents a single cell in a maze.
 *
 * The Cell (model) class holds cell data, but doesn't perform any actions
 * aside from providing access to private member variables. This class serves
 * as a data object that can be passed around, stored, and retrieved easily.
 */
export class Cell {
    private location: Location;
    private exits: number;
    private tags: number;
    private trap: number;
    private visits: number;
    private lastVisit: number;
    private notes: Array<string>;

    constructor(data?: Cell) {
        if (data !== undefined) {
            this.location = data.location;
            this.exits = data.exits;
            this.tags = data.tags;
            this.trap = data.trap;
            this.visits = data.visits;
            this.lastVisit = data.lastVisit;
            this.notes = data.notes;
        } else {
            this.location = new Location(0, 0);
            this.exits = DIRS.NONE;
            this.tags = CELL_TAGS.NONE;
            this.trap = CELL_TRAPS.NONE;
            this.visits = 0;
            this.lastVisit = 0;
            this.notes = new Array<string>();
        }
    }

    public set Notes(notes: string[]) {
        this.notes = notes;
    }

    public get Notes(): string[] {
        return this.notes;
    }

    public set Visits(visitCount: number) {
        this.visits = visitCount;
    }

    public get Visits(): number {
        return this.visits;
    }

    public set LastVisitMoveNum(moveNumber: number) {
        this.lastVisit = moveNumber;
    }

    public get LastVisitMoveNum(): number {
        return this.lastVisit;
    }

    public get Exits(): number {
        return this.exits;
    }

    public set Exits(newExits: number) {
        this.exits = newExits;
    }

    public get Location(): Location {
        return this.location;
    }

    public set Location(location: Location) {
        this.location = location;
    }

    /**
     * Returns the bitwise integer containing cell tags
     */
    public get Tags(): number {
        return this.tags;
    }

    /**
     * Set the cell's tags to the given bitwise value
     */
    public set Tags(tags: number) {
        this.tags = tags;
    }

    /**
     * Returns the enum value of the cell's trap (0 if none)
     */
    public get Trap(): CELL_TRAPS {
        return this.trap;
    }

    /**
     * Sets the cells trap value to the given enum value
     */
    public set Trap(trap: CELL_TRAPS) {
        this.trap = trap;
    }
}

export default Cell;
