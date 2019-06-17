import { ObjectBase } from './ObjectBase';
// An engram contains a snapshot of sensory data correlating to the
// player's position within the maze.  Each sense is a string.
//
// Example:
// sight = "You are standing in a room. There are exits to the North and South."
// sound = "You hear the sound of dripping water coming from the South."

export class Engram extends ObjectBase {
  public sight: string;
  public sound: string;
  public smell: string;
  public touch: string;
  public taste: string;

  constructor(data?: any) {
    super();
    this.sight = 'You see...';
    this.sound = 'You hear...';
    this.smell = 'You smell...';
    this.touch = 'You feel...';
    this.taste = 'You taste...';

    if (data !== undefined) {
      this.sight = this.validateDataField('sight', data.sight, 'string');
      this.sound = this.validateDataField('sound', data.sound, 'string');
      this.smell = this.validateDataField('smell', data.smell, 'string');
      this.touch = this.validateDataField('touch', data.touch, 'string');
      this.taste = this.validateDataField('taste', data.taste, 'string');
    }
  }
}
