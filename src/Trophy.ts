import { Logger } from '@mazemasterjs/logger';
const log = Logger.getInstance();

/**
 * Trohpies are awarded by the game server when certain
 * player actions or accomplisments are detected.
 *
 * See /data/trohpy-list.json for a list of available trophies.
 *
 */
export class Trophy {
  private id: string;
  private name: string;
  private description: string;
  private bonusAward: number;
  private count: number;
  private lastUpdated: number;

  constructor(data: Trophy) {
    // validate that the any-type data matches the interface
    if (!this.isValid(data)) {
      const err = new Error('Invalid object data provided. See @mazemasterjs/shared-library/Trophy for data requirements.');
      log.error(__filename, 'constructor(data?: Trophy)', 'Error instantiating object ->', err);
      throw err;
    }

    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.bonusAward = data.bonusAward;
    this.count = data.count;
    this.lastUpdated = data.lastUpdated;
  }

  public get Id(): string {
    return this.id;
  }
  public get Name(): string {
    return this.name;
  }
  public get Description(): string {
    return this.description;
  }
  public get BonusAward(): number {
    return this.bonusAward;
  }
  public get Count(): number {
    return this.count;
  }
  public set Count(count: number) {
    this.count = count;
  }
  public get LastUpdated(): number {
    return this.lastUpdated;
  }
  public addCount() {
    this.lastUpdated = Date.now();
    this.count++;
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
      typeof data.description === 'string' &&
      typeof data.bonusAward === 'number' &&
      typeof data.count === 'number' &&
      typeof data.lastUpdated === 'number';

    if (!valid) {
      log.warn(__filename, `isValid(${JSON.stringify(data)})`, 'Data validation failed.');
    } else {
      log.debug(__filename, 'isValid(data:any)', 'Data validated.');
    }

    return valid;
  }
}

export default Trophy;
