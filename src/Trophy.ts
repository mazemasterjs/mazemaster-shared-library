import { ObjectBase } from './ObjectBase';

/**
 * Trohpies are awarded by the game server when certain
 * player actions or accomplisments are detected.
 *
 * See https://github.com/mazemasterjs/service-base/blob/development/data/default-trophy-list.json
 *
 */
export class Trophy extends ObjectBase {
  private id: string;
  private name: string;
  private description: string;
  private bonusAward: number;

  constructor(data: Trophy) {
    super();

    this.id = this.validateDataField('id', data.id, 'string');
    this.name = this.validateDataField('name', data.name, 'string');
    this.description = this.validateDataField('description', data.description, 'string');
    this.bonusAward = this.validateDataField('bonusAward', data.bonusAward, 'number');
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
}

export default Trophy;
