/**
 * Team is an individual code-camp team that includes a collection of Bots
 */
import uuid from 'uuid/v4';
import { Bot } from './Bot';
import { TROPHY_IDS } from './Enums';
import { IBot } from './IBot';
import { ITrophyStub } from './ITrophyStub';
import { Logger } from '@mazemasterjs/logger';
import * as helpers from './Helpers';

// instantiate a logger
const log = Logger.getInstance();

export class Team {
  private name: string;
  private id: string;
  private logo: string;
  private trophies: Array<ITrophyStub>;
  private bots: Array<Bot>;

  constructor(data?: Team) {
    if (data !== undefined) {
      // validate that the any-type data matches the interface
      if (!this.isValid(data)) {
        const err = new Error('Invalid object data provided. See @mazemasterjs/shared-library/Team for field requirements.');
        log.error(__filename, 'constructor(data?: Team)', 'Error instantiating object ->', err);
        throw err;
      }

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

  /**
   * Increase count of existing trophy or add a new trophy
   * if count trophy is not found.
   *
   * @param trophyId
   */
  public grantTrophy(trophyId: TROPHY_IDS) {
    this.trophies = helpers.grantTrophy(trophyId, this.trophies);
  }

  /**
   * Returns the count (number of times awarded) of the
   * trophy with the given TrophyId from Enums.TROPHY_IDS
   *
   * @param trophyId (Enums.TROPHY_IDS) - The Id of the trophy to get a count of
   */
  public getTrophyCount(trophyId: TROPHY_IDS): number {
    return helpers.getTrophyCount(trophyId, this.trophies);
  }

  /**
   * @returns a Map<Enums.TROPHY_IDS, number> containing awarded TrophyIds(key) and Counts (val)
   */
  public get Trophies(): Array<ITrophyStub> {
    return this.trophies;
  }

  /**
   * Have to manually validate provided data object since it
   * it could be provided by a JSON document body or loaded
   * as a JSON document from the database.
   */
  private isValid(data: any): boolean {
    const valid =
      typeof data.name === 'string' &&
      typeof data.id === 'string' &&
      typeof data.logo === 'string' &&
      typeof data.trophies === 'object' &&
      typeof data.bots === 'object';

    if (!valid) {
      log.warn(__filename, `isValid(${JSON.stringify(data)})`, 'Data validation failed.');
    } else {
      log.trace(__filename, 'isValid(data:any)', 'Data validated.');
    }

    return valid;
  }

  private loadBotsArray(bots: Array<Bot>) {
    for (const bot of bots) {
      const newIBot: IBot = JSON.parse(JSON.stringify(bot));
      this.bots.push(new Bot(newIBot));
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
}
