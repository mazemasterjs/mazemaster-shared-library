/**
 * Trohpies are awarded by the game server when certain
 * player actions or accomplisments are detected.
 *
 * See /data/trohpy-list.json for a list of available trophies.
 *
 */
export class Trophy {
  private id: number;
  private name: string;
  private description: string;
  private bonusAward: number;
  private count: number;

  constructor(data: Trophy) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.bonusAward = data.bonusAward;
    this.count = data.count;
  }

  public get Id(): number {
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
  public addCount() {
    this.count++;
  }
}

export default Trophy;
