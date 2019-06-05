import { IEngram } from './IEngram';
// An engram contains a snapshot of sensory data correlating to the
// player's position within the maze.  Each sense is a string.
//
// Example:
// sight = "You are standing in a room. There are exits to the North and South."
// sound = "You hear the sound of dripping water coming from the South."

export class Engram {
  private sight: string;
  private sound: string;
  private smell: string;
  private touch: string;
  private taste: string;

  constructor(data?: IEngram) {
    if (data) {
      this.sight = data.sight.trim();
      this.sound = data.sound.trim();
      this.smell = data.smell.trim();
      this.touch = data.touch.trim();
      this.taste = data.taste.trim();
    } else {
      this.sight = '';
      this.sound = '';
      this.smell = '';
      this.touch = '';
      this.taste = '';
    }
  }

  public get Sight(): string {
    return this.sight;
  }

  public set Sight(sight: string) {
    this.sight = sight;
  }

  public get Sound(): string {
    return this.sound;
  }

  public set Sound(sound: string) {
    this.sound = sound;
  }

  public get Smell(): string {
    return this.smell;
  }

  public set Smell(smell: string) {
    this.smell = smell;
  }

  public get Touch(): string {
    return this.touch;
  }

  public set Touch(touch: string) {
    this.touch = touch;
  }

  public get Taste(): string {
    return this.taste;
  }

  public set Taste(taste: string) {
    this.taste = taste;
  }
}
