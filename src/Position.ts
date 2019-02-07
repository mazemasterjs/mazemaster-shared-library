import { format } from 'util';

// Position - X, Y Coordinates within the maze grid
export class Position implements Position {
    public row: number;
    public col: number;

    constructor(col: number, row: number) {
        this.col = col;
        this.row = row;
    }

    /**
     * Returns true of values of given Pos instance match
     * the values of the current Pos
     * @param position
     */
    public equals(position: Position): boolean {
        return this.col == position.col && this.row == position.row;
    }

    public toString(): string {
        return format('col: %s, row: %s', this.col, this.row);
    }
}

export default Position;
