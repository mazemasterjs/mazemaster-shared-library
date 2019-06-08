import IMazeLoc from './Interfaces/IMazeLoc';

/**
 * Simple x, y coordinates class used for maze positioning
 *
 */
export class MazeLoc implements IMazeLoc {
  /**
   * Return an instance from JSON data
   */

  public static fromJSON(data: MazeLoc) {
    return new MazeLoc(data.row, data.col);
  }

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
  public equals(location: MazeLoc): boolean {
    return this.row === location.row && this.col === location.col;
  }

  public toString(): string {
    return `${this.row}, ${this.col}`;
  }
}

export default MazeLoc;
