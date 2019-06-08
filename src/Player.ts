import { PLAYER_STATES } from './Enums';
import MazeLoc from './MazeLoc';

// Class to maintain player state during a game
export class Player {
  private location: MazeLoc;
  private state: PLAYER_STATES;

  constructor(location: MazeLoc, state: PLAYER_STATES) {
    this.location = location;
    this.state = state;
  }

  public get Location(): MazeLoc {
    return this.location;
  }
  public set Location(value: MazeLoc) {
    this.location = value;
  }

  public get State(): PLAYER_STATES {
    return this.state;
  }

  public clearStates() {
    this.state = PLAYER_STATES.STANDING;
  }

  /**
   * Adds a PLAYER_STATES value, taking care to ensure that mutually-exclusive
   * states are toggled appropriately.  e.g. Player cannot be both sitting and standing.
   *
   * @param state
   */
  public addState(state: PLAYER_STATES) {
    if (!(this.state & state)) {
      this.state += state;
      if (state === PLAYER_STATES.SITTING) {
        this.removeState(PLAYER_STATES.STANDING);
        this.removeState(PLAYER_STATES.LYING);
      }
      if (state === PLAYER_STATES.LYING) {
        this.removeState(PLAYER_STATES.STANDING);
        this.removeState(PLAYER_STATES.SITTING);
      }
      if (state === PLAYER_STATES.STANDING) {
        this.removeState(PLAYER_STATES.SITTING);
        this.removeState(PLAYER_STATES.LYING);
      }
    }
  }

  /**
   * Removes a PLAYER_STATES bitwise value.  If PLAYER_STATES == NONE, player will reverted to the "STANDING"
   * state by default
   *
   * @param state
   */
  public removeState(state: PLAYER_STATES) {
    if (!!(this.state & state)) {
      this.state -= state;
    }

    // there really isn't a "none" state - if nothing else, the player will be STANDING
    if (this.state === PLAYER_STATES.NONE) {
      this.state = PLAYER_STATES.STANDING;
    }
  }
}
