/**
 * Team is an individual code-camp team that includes a collection of Bots
 */
import uuid from 'uuid/v4';
import { Bot } from './Bot';
import { TROPHY_IDS } from './Enums';
import { IBot } from './IBot';
import { ITrophyStub } from './ITrophyStub';

export class Team {
  private name: string;
  private id: string;
  private logo: string;
  private trophies: Array<ITrophyStub>;
  private bots: Array<Bot>;

  constructor(data?: Team) {
    if (data !== undefined) {
      this.name = data.name;
      this.bots = new Array<Bot>();
      this.loadBotsArray(data.bots);
      this.id = data.id;
      this.logo = data.logo;
      this.trophies = data.trophies;
    } else {
      this.name = '';
      this.id = uuid();
      this.bots = new Array<Bot>();
      this.logo = '';
      this.trophies = new Array<ITrophyStub>();
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

  /**
   * Increase count of existing trophy or add a new trophy
   * if count trophy is not found.
   *
   * @param trophyId
   */
  public addTrophy(trophyId: TROPHY_IDS) {
    // first check for existing trophy and increment count
    for (const trophy of this.trophies) {
      if (trophy.id === trophyId) {
        trophy.count++;
        return;
      }
    }

    // trophy wasn't found, so we have to add it with a
    // count of 1
    const tStub: ITrophyStub = {
      count: 1,
      id: trophyId,
      name: TROPHY_IDS[trophyId],
    };

    this.trophies.push(tStub);
  }

  /**
   * Returns the count (number of times awarded) of the
   * trophy with the given TrophyId from Enums.TROPHY_IDS
   *
   * @param trophyId (Enums.TROPHY_IDS) - The Id of the trophy to get a count of
   */
  public getTrophyCount(trophyId: TROPHY_IDS): number {
    for (const trophy of this.trophies) {
      if (trophy.id === trophyId) {
        return trophy.count;
      }
    }
    return 0;
  }

  /**
   * @returns a Map<Enums.TROPHY_IDS, number> containing awarded TrophyIds(key) and Counts (val)
   */
  public get Trophies(): Array<ITrophyStub> {
    return this.trophies;
  }

  private loadBotsArray(bots: Array<Bot>) {
    for (const bot of bots) {
      const newIBot: IBot = JSON.parse(JSON.stringify(bot));
      this.bots.push(new Bot(newIBot));
    }
  }
}
