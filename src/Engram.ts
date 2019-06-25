import { ObjectBase } from './ObjectBase';
// An engram contains a snapshot of sensory data correlating to the
// player's position within the maze.  Each sense is a string.
//
// Example:
// sight = "You are standing in a room. There are exits to the North and South."
// sound = "You hear the sound of dripping water coming from the South."

export class Engram extends ObjectBase {
  public sight: Array<any>;
  public sound: Array<any>;
  public smell: Array<any>;
  public touch: Array<any>;
  public taste: Array<any>;

  constructor(data?: any) {
    super();
    this.sight = new Array();
    this.sound = new Array();
    this.smell = new Array();
    this.touch = new Array();
    this.taste = new Array();

    if (data !== undefined) {
      this.sight = this.validateDataField('sight', data.sight, 'array');
      this.sound = this.validateDataField('sound', data.sound, 'array');
      this.smell = this.validateDataField('smell', data.smell, 'array');
      this.touch = this.validateDataField('touch', data.touch, 'array');
      this.taste = this.validateDataField('taste', data.taste, 'array');
    }
  }
}
