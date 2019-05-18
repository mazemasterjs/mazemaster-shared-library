import uuid from 'uuid/v4';
import { IBot } from './IBot';
import { ITrophyStub } from './ITrophyStub';
import { TROPHY_IDS } from './Enums';
import { Logger } from '@mazemasterjs/logger';

/**
 * An individual, maze-running bot.
 * May be associated with team and coder via GUID
 * relationships to score, game, and team documents
 * in the mmjs database.
 */

// logger is useful as a global const
const log = Logger.getInstance();

export class Bot {
  private id: string;
  private name: string;
  private weight: number;
  private coder: string;
  private trophies: Array<ITrophyStub>;

  constructor(data?: IBot) {
    if (data !== undefined) {
      // validate that the any-type data matches the interface
      if (!this.isValid(data)) {
        const err = new Error(
          'Invalid object data provided. See @mazemasterjs/shared-library/IBot for interface requirements.',
        );
        log.error(__filename, 'constructor(data?: IBot)', 'Error instantiating object ->', err);
        throw err;
      }

      this.id = data.id;
      this.name = data.name;
      this.weight = data.weight;
      this.coder = data.coder;
      this.trophies = data.trophies;
    } else {
      this.id = uuid();
      this.name = '';
      this.weight = 100;
      this.coder = '';
      this.trophies = new Array<ITrophyStub>();
    }
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
   * Have to manually validate provided data object since it
   * it could be provided by a JSON document body or loaded
   * as a JSON document from the database.
   */
  private isValid(data: any): boolean {
    const valid =
      typeof data.id === 'string' &&
      typeof data.name === 'string' &&
      typeof data.weight === 'number' &&
      typeof data.coder === 'string' &&
      typeof data.trophies === 'object';

    if (!valid) {
      log.warn(__filename, `isValid(${JSON.stringify(data)})`, 'Data validation failed.');
    } else {
      log.trace(__filename, 'isValid(data:any)', 'Data validated.');
    }

    return valid;
  }

  /**
   * @returns string - The UUID identifier for this bot
   */
  public get Id(): string {
    return this.id;
  }

  /**
   * @returns string - The name of the bot.
   */
  public get Name(): string {
    return this.name;
  }

  /**
   * Set the name of the bot
   *
   * @param name (string) - the name of the bot
   */
  public set Name(name: string) {
    this.name = name;
  }

  /**
   * @returns number - The weighting used for this bot's recommendations during team games
   */
  public get Weight(): number {
    return this.weight;
  }

  /**
   * Set the bot's weighting for team games
   * @param weight (number) - the bot's weighting for team games
   */
  public set Weight(weight: number) {
    this.weight = weight;
  }

  /**
   * @returns string - The name of the coder who owns this bot.
   */
  public get Coder(): string {
    return this.coder;
  }

  /**
   * Set the name of the bot's coder
   * @param name - (string) The name of the bot's coder
   */
  public set Coder(name: string) {
    this.coder = name;
  }

  /**
   * @returns a Map<Enums.TROPHY_IDS, number> containing awarded TrophyIds(key) and Counts (val)
   */
  public get Trophies(): Array<ITrophyStub> {
    return this.trophies;
  }
}

export default Bot;
