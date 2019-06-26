import { IFeeling, ISenses, ISight, ISmell, ISound, ITaste } from './Interfaces/ISenses';

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

    // populate with empty sense data
    const sights: ISight = { sight: '', distance: -1 };
    const sounds: ISound = { sound: '', volume: -1 };
    const smells: ISmell = { scent: '', strength: -1 };
    const tastes: ITaste = { taste: '', strength: -1 };
    const feelings: IFeeling = { feeling: '', intensity: -1 };
    const senses: ISenses = { see: [sights], hear: [sounds], smell: [smells], taste: [tastes], feel: [feelings] };

    this.north = senses;
    this.south = senses;
    this.east = senses;
    this.west = senses;
    this.here = senses;

    if (data !== undefined) {
      this.north = this.validateDataField('north', data.north, 'object');
      this.south = this.validateDataField('south', data.south, 'object');
      this.east = this.validateDataField('east', data.east, 'object');
      this.west = this.validateDataField('west', data.west, 'object');
      this.here = this.validateDataField('here', data.here, 'object');
    }
  }
}
