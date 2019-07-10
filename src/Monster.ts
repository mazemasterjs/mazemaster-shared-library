import { MazeLoc } from './MazeLoc';
import { DIRS, MONSTER_STATES, MONSTER_TAGS } from './Enums';

// Class to maintain player state during a game
export default class Monster {
  private location: MazeLoc;
  private state: MONSTER_STATES;
  private facing: DIRS;
  private life: number;
  private tags: MONSTER_TAGS;

  constructor(location: MazeLoc, state: MONSTER_STATES, tags: MONSTER_TAGS, facing: DIRS, life: number = 100) {
    this.location = location;
    this.state = state;
    this.facing = facing;
    this.life = life;
    this.tags = tags;
  }

  public get Location(): MazeLoc {
    return this.location;
  }
  public set Location(mazeLoc: MazeLoc) {
    this.location = mazeLoc;
  }

  public get State(): MONSTER_STATES {
    return this.state;
  }

  public clearStates() {
    this.state = MONSTER_STATES.STANDING;
  }

  // Gets and retrieves the cardinal direction the monster is facing
  public set Facing(dir: DIRS) {
    this.facing = dir;
  }

  public get Facing() {
    return this.facing;
  }

  public set Life(num: number) {
    this.life = num;
  }

  public get Life() {
    return this.life;
  }

  /**
   * Adds a MONSTER_STATES value, taking care to ensure that mutually-exclusive
   * states are toggled appropriately.  e.g. Player cannot be both sitting and standing.
   *
   * @param state
   */
  public addState(state: MONSTER_STATES) {
    if (!(this.state & state)) {
      this.state += state;
      if (state === MONSTER_STATES.SITTING) {
        this.removeState(MONSTER_STATES.STANDING);
        this.removeState(MONSTER_STATES.LYING);
      }
      if (state === MONSTER_STATES.LYING) {
        this.removeState(MONSTER_STATES.STANDING);
        this.removeState(MONSTER_STATES.SITTING);
      }
      if (state === MONSTER_STATES.STANDING) {
        this.removeState(MONSTER_STATES.SITTING);
        this.removeState(MONSTER_STATES.LYING);
      }
    }
  }

  /**
   * Removes a MONSTER_STATES bitwise value.  If MONSTER_STATES == NONE, player will reverted to the "STANDING"
   * state by default
   *
   * @param state
   */
  public removeState(state: MONSTER_STATES) {
    if (!!(this.state & state)) {
      this.state -= state;
    }

    // there really isn't a "none" state - if nothing else, the player will be STANDING
    if (this.state === MONSTER_STATES.NONE) {
      this.state = MONSTER_STATES.STANDING;
    }
  }

  public getTag() {
    return this.tags;
  }
  /**
   * Adds to a monsters tags
   */
  public addTag(tag: MONSTER_TAGS) {
    if (!(this.tags & tag)) {
      this.tags += tag;
    }
    return;
  }
  /**
   * Remove a monsters tags
   */
  public removeTag(tag: MONSTER_TAGS) {
    if (!!(this.tags & tag)) {
      this.tags -= tag;
    }
  }

  public equals(monster: Monster) {
    return (
      this.Location.col === monster.Location.col && this.Location.row === monster.Location.row && this.tags === monster.tags && this.State === monster.State
    );
  }
}
