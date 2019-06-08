export interface IMazeLoc {
  row: number;
  col: number;
  equals(location: IMazeLoc): boolean;
  toString(): string;
}

export default IMazeLoc;
