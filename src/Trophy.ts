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
    this.id = this.validate('id', data.id, 'string');
    this.name = this.validate('name', data.name, 'string');
    this.description = this.validate('description', data.description, 'string');
    this.bonusAward = this.validate('bonusAward', data.bonusAward, 'number');
    this.count = this.validate('count', data.count, 'number');
    this.lastUpdated = this.validate('lastUpdated', data.lastUpdated, 'number');
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
   * Validate that the given value is of the expected type.
   *
   * @param field string - the field name being validated
   * @param val any - the field value to check for proper typing
   * @param type string - the type name to check for for
   *
   * @returns any - Returns the given val if validation succeeds
   * @throws Error - Will throw a 'Type Error' if the typing is incrrect
   */
  private validate(field: string, val: any, type: string): any {
    if (typeof val !== type) {
      const err: Error = new Error(`${field}:${val} is not of type ${type}`);
      log.error(__filename, `isValid(${field}, ${val}, ${type})`, 'Type Error ->', err);
      throw err;
    }
  }
}

export default Trophy;
