import { DIRS } from '../Enums';

export interface ISight {
  sight: string;
  distance: number;
}

export interface ISound {
  sound: string;
  volume: number;
}

export interface ISmell {
  scent: string;
  strength: number;
}

export interface ITaste {
  taste: string;
  strength: number;
}

export interface IFeeling {
  feeling: string;
  intensity: number;
}

/**
 * Intuition can be used to convey non-visible information like
 * "You feel uneasy"  (something bad is near?)
 * "You feel like you've been here before" (backtracking?)
 * "The darkness seems somehow less oppressive " (nearing exit?)
 *
 */
export interface IIntuition {
  message: string;
  confidence: number;
  direction: DIRS;
}

export interface IHere {
  exitNorth: boolean;
  exitSouth: boolean;
  exitEast: boolean;
  exitWest: boolean;
  items: Array<any>; // for items, objects, whatever
  messages: Array<any>; // messages (e.g. cell.notes())
  intuition: IIntuition; //
}

export interface ISenses {
  see: Array<ISight>;
  hear: Array<ISound>;
  smell: Array<ISmell>;
  taste: Array<ITaste>;
  feel: Array<IFeeling>;
}
