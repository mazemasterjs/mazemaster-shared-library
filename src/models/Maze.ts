import seedrandom from 'seedrandom';
import {format as fmt} from 'util';
import Cell from './Cell';
import {CELL_TAGS, CELL_TRAPS, DIRS} from '../Enums';
import {Logger, LOG_LEVELS} from '@mazemasterjs/logger';
import {Location} from '../Location';
import Config from '../Config';

/**
 * Represents a maze, which is a collection of Cell (model) objects aranged in
 * a two dimensional array.
 *
 * The Maze (model) class holds maze data, but doesn't perform any actions
 * aside from providing access to private member variables. This class serves
 * as a data object that can be passed around, stored, and retrieved easily.
 */
export class Maze {
    private id: string;
    private height: number;
    private width: number;
    private cellCount: number;
    private name: string;
    private seed: string;
    private challenge: number;
    private cells: Array<Array<Cell>>;
    private textRender: string;
    private startCellLoc: Location;
    private finishCellLoc: Location;
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
            this.cellCount = data.cellCount;
            this.challenge = data.challenge;
            this.name = data.name;
            this.seed = data.seed;
            this.id = data.id;
            this.startCellLoc = data.startCellLoc;
            this.finishCellLoc = data.finishCellLoc;
            this.shortestPathLength = data.shortestPathLength;
            this.trapCount = data.trapCount;
            this.note = data.note;
            this.cells = data.cells;
            this.textRender = data.textRender;
        } else {
            this.height = 0;
            this.width = 0;
            this.cellCount = 0;
            this.challenge = 0;
            this.name = '';
            this.seed = '';
            this.id = '';
            this.startCellLoc = new Location(0, 0);
            this.finishCellLoc = new Location(0, 0);
            this.shortestPathLength = 0;
            this.trapCount = 0;
            this.note = '';
            this.cells = new Array<Array<Cell>>();
            this.textRender = '';
        }
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
        return this.cellCount;
    }
    public get TextRender(): string {
        return this.textRender;
    }
    public get Id(): string {
        return this.id;
    }
    public get StartCellLoc(): Location {
        return this.startCellLoc;
    }
    public get FinishCellLoc(): Location {
        return this.finishCellLoc;
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

    public set Height(height: number) {
        this.height = height;
    }
    public set Width(width: number) {
        this.width = width;
    }
    public set Seed(seed: string) {
        this.seed = seed;
    }
    public set ChallengeLevel(challenge: number) {
        this.challenge = challenge;
    }
    public set Cells(cells: Array<Array<Cell>>) {
        this.cells = cells;
    }
    public set CellCount(cellCount: number) {
        this.cellCount = cellCount;
    }
    public set TextRender(textRender: string) {
        this.textRender = textRender;
    }
    public set Id(id: string) {
        this.id = id;
    }
    public set StartCellLoc(startCellLoc: Location) {
        this.startCellLoc = startCellLoc;
    }
    public set FinishCellLoc(finishCellLoc: Location) {
        this.finishCellLoc = finishCellLoc;
    }
    public set ShortestPathLength(shortestPathLength: number) {
        this.shortestPathLength;
    }
    public set TrapCount(trapCount: number) {
        this.trapCount = trapCount;
    }
    public set Note(value: string) {
        this.note = value;
    }
}

export default Maze;
