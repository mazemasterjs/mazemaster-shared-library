import { cloneDeep } from 'lodash';
import { ISenses } from './Interfaces/ISenses';
import { ObjectBase } from './ObjectBase';

// An engram contains a snapshot of sensory data correlating to the
// player's position within the maze and representing five different directions:
// North, South, East, West, and Here

export class Engram extends ObjectBase {
  public north: ISenses;
  public south: ISenses;
  public east: ISenses;
  public west: ISenses;
  public here: ISenses;

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
        see: [{ sight: '', distance: -1 }],
        hear: [{ sound: '', volume: -1 }],
        smell: [{ scent: '', strength: -1 }],
        taste: [{ taste: '', strength: -1 }],
        feel: [{ feeling: '', intensity: -1 }],
      };

      this.north = cloneDeep(senses);
      this.south = cloneDeep(senses);
      this.east = cloneDeep(senses);
      this.west = cloneDeep(senses);
      this.here = cloneDeep(senses);
    }
  }
}
