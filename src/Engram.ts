import { cloneDeep } from 'lodash';
import { DIRS } from './Enums';
import { IHere, IIntuition, ISenses } from './Interfaces/ISenses';
import { ObjectBase } from './ObjectBase';

// An engram contains a snapshot of sensory data correlating to the
// player's position within the maze and representing five different directions:
// North, South, East, West, and Here

export class Engram extends ObjectBase {
  public north: ISenses;
  public south: ISenses;
  public east: ISenses;
  public west: ISenses;
  public here: IHere;

  constructor(data?: any) {
    super();

    if (data !== undefined) {
      this.north = this.validateDataField('north', data.north, 'object');
      this.south = this.validateDataField('south', data.south, 'object');
      this.east = this.validateDataField('east', data.east, 'object');
      this.west = this.validateDataField('west', data.west, 'object');
      this.here = this.validateDataField('here', data.here, 'object');
    } else {
      const senses: ISenses = {
        see: [{ sight: 'nothing', distance: 0 }],
        hear: [{ sound: 'nothing', volume: 0 }],
        smell: [{ scent: 'nothing', strength: 0 }],
        taste: [{ taste: 'nothing', strength: 0 }],
        feel: [{ feeling: 'nothing', intensity: 0 }],
      };

      // need an intuition object for here
      const intuition: IIntuition = { message: '', confidence: 0, direction: DIRS.NONE };

      // and a here to add to the base engram
      const here = { exitNorth: false, exitSouth: false, exitEast: false, exitWest: false, items: [''], messages: [''], intuition: cloneDeep(intuition) };

      this.north = cloneDeep(senses);
      this.south = cloneDeep(senses);
      this.east = cloneDeep(senses);
      this.west = cloneDeep(senses);
      this.here = cloneDeep(here);
    }
  }
}
