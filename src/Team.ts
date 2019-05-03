/**
 * Team is an individual code-camp team that includes a collection of Bots
 */
import uuid from 'uuid/v4';
import { Bot } from './Bot';
import { TROPHY_IDS } from './Enums';

export class Team {
  private name: string;
  private id: string;
  private logo: string;
  private trophies: Map<number, number>;
  private bots: Array<Bot>;

  constructor(data?: Team) {
    if (data !== undefined) {
      this.name = data.name;
      this.bots = data.bots;
      this.id = data.id;
      this.logo = data.logo;
      this.trophies = new Map(data.trophies);
    } else {
      this.name = '';
      this.id = uuid();
      this.bots = new Array<Bot>();
      this.logo = '';
      this.trophies = new Map();
    }
  }

  public get Id() {
    return this.id;
  }

  public get Name() {
    return this.name;
  }

  public get Bots(): Array<Bot> {
    return this.bots;
  }

  public get Logo(): string {
    return this.logo;
  }

  public addTrophy(trophyId: TROPHY_IDS) {
    for (let [tId, tCnt] of this.trophies) {
      if (tId === trophyId) {
        tCnt = tCnt + 1;
      }
    }
    this.trophies.set(trophyId, 1);
  }

  /**
   * Returns the count (number of times awarded) of the
   * trophy with the given TrophyId from Enums.TROPHY_IDS
   *
   * @param trophyId (Enums.TROPHY_IDS) - The Id of the trophy to get a count of
   */
  public getTrophyCount(trophyId: TROPHY_IDS): number {
    for (const [tId, tCnt] of this.trophies) {
      if (tId === trophyId) {
        return tCnt;
      }
    }
    return 0;
  }

  /**
   * @returns a Map<number, number> containing awarded TrophyIds(key) and Counts (val)
   */
  public getTrophies(): Map<number, number> {
    return this.trophies;
  }
}
