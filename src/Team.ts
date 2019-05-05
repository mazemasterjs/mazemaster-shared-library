/**
 * Team is an individual code-camp team that includes a collection of Bots
 */
import uuid from 'uuid/v4';
import { Bot } from './Bot';
import { TROPHY_IDS } from './Enums';
import { IBot } from './IBot';

export class Team {
  private name: string;
  private id: string;
  private logo: string;
  private trophies: Map<TROPHY_IDS, number>;
  private bots: Array<Bot>;

  constructor(data?: Team) {
    if (data !== undefined) {
      this.name = data.name;
      this.bots = new Array<Bot>();
      this.loadBotsArray(data.bots);
      this.id = data.id;
      this.logo = data.logo;
      this.trophies = new Map<TROPHY_IDS, number>();
      this.loadTrophies(data.trophies);
    } else {
      this.name = '';
      this.id = uuid();
      this.bots = new Array<Bot>();
      this.logo = '';
      this.trophies = new Map<TROPHY_IDS, number>();
    }
  }

  public get Id() {
    return this.id;
  }

  public get Name() {
    return this.name;
  }

  public set Name(teamName: string) {
    this.name = teamName;
  }

  public get Bots(): Array<Bot> {
    return this.bots;
  }

  public set Bots(bots: Array<Bot>) {
    this.bots = bots;
  }

  public get Logo(): string {
    return this.logo;
  }

  public set Logo(imageFileName: string) {
    this.logo = imageFileName;
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
   * @returns a Map<Enums.TROPHY_IDS, number> containing awarded TrophyIds(key) and Counts (val)
   */
  public get Trophies(): Map<TROPHY_IDS, number> {
    return this.trophies;
  }

  private loadBotsArray(bots: Array<Bot>) {
    for (const bot of bots) {
      const newIBot: IBot = JSON.parse(JSON.stringify(bot));
      this.bots.push(new Bot(newIBot));
    }
  }

  private loadTrophies(trophies: Map<TROPHY_IDS, number>) {
    for (const [key, value] of Object.entries(trophies)) {
      this.trophies.set(parseInt(key, 10), value);
    }
  }
}
