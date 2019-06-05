/**
 * Team is an individual code-camp team that includes a collection of Bots
 */
import { Bot } from './Bot';
import { TROPHY_IDS } from './Enums';
import { IBot } from './IBot';
import { ITrophyStub } from './ITrophyStub';
import { ObjectBase } from './ObjectBase';

export class Team extends ObjectBase {
  private name: string;
  private id: string;
  private logo: string;
  private trophies: Array<ITrophyStub>;
  private bots: Array<Bot>;

  constructor(data?: Team) {
    super();

    if (data !== undefined) {
      this.id = this.validateField('id', data.id, 'string');
      this.name = this.validateField('name', data.name, 'string');
      this.logo = this.validateField('logo', data.logo, 'string');
      this.bots = this.loadBotsArray(data.bots);
      this.trophies = data.trophies;
    } else {
      this.id = this.generateId();
      this.name = '';
      this.logo = '';
      this.bots = new Array<Bot>();
      this.trophies = new Array<ITrophyStub>();
    }
  }

  /**
   * Increase count of existing trophy or add a new trophy
   * if count trophy is not found.
   *
   * @param trophyId
   */
  public grantTrophy(trophyId: TROPHY_IDS) {
    this.trophies = this.addTrophy(trophyId, this.trophies);
  }

  /**
   * Returns the count (number of times awarded) of the
   * trophy with the given TrophyId from Enums.TROPHY_IDS
   *
   * @param trophyId (Enums.TROPHY_IDS) - The Id of the trophy to get a count of
   */
  public getTrophyCount(trophyId: TROPHY_IDS): number {
    return this.countTrophy(trophyId, this.trophies);
  }

  /**
   * @returns a Map<Enums.TROPHY_IDS, number> containing awarded TrophyIds(key) and Counts (val)
   */
  public get Trophies(): Array<ITrophyStub> {
    return this.trophies;
  }

  /**
   * Coerce json bot data into array of Bot objects and return.
   * This enforces data validation and returns concrete, functional
   * Bot objects.
   *
   * @param bots
   */
  private loadBotsArray(bots: Array<Bot>): Array<Bot> {
    const retBots = new Array<Bot>();

    for (const bot of bots) {
      const newIBot: IBot = JSON.parse(JSON.stringify(bot));
      retBots.push(new Bot(newIBot));
    }

    return retBots;
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
}
