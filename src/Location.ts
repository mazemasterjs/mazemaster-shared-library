import { format } from 'util';

// Location - X, Y Coordinates within the maze grid
export class Location {
    public row: number;
    public col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    /**
     * Returns true of values of given Pos instance match
     * the values of the current Pos
     * @param location
     */
    public equals(location: Location): boolean {
        return this.row == location.row && this.col == location.col;
    }

    public toString(): string {
        return format('%s, %s', this.row, this.col);
    }
}

export default Location;
