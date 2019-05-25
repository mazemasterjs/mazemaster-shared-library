import uuid from 'uuid/v4';
import { IBot } from './IBot';
import { ITrophyStub } from './ITrophyStub';
import { TROPHY_IDS } from './Enums';
import { ObjectBase } from './ObjectBase';

/**
 * An individual, maze-running bot.
 * May be associated with team and coder via GUID
 * relationships to score, game, and team documents
 * in the mmjs database.
 */

export class Bot extends ObjectBase {
  private id: string;
  private name: string;
  private weight: number;
  private coder: string;
  private trophies: Array<ITrophyStub>;

  constructor(data?: IBot) {
    super();

    if (data !== undefined) {
      this.id = this.validate('id', data.id, 'string');
      this.name = this.validate('name', data.name, 'string');
      this.weight = this.validate('name', data.weight, 'number');
      this.coder = this.validate('name', data.coder, 'string');
      this.trophies = this.validate('trophies', data.trophies, 'object');
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
