import uuid from 'uuid';

/**
 * An individual, maze-running bot.
 * May be associated with team and coder via GUID
 * relationships to score, game, and team documents
 * in the mmjs database.
 */

export class Bot {
  private id: string;
  private name: string;
  private weight: number;
  private coder: string;

  constructor(data?: Bot) {
    if (data !== undefined) {
      this.id = data.id;
      this.name = data.name;
      this.weight = data.weight;
      this.coder = data.coder;
    } else {
      this.id = uuid();
      this.name = '';
      this.weight = 100;
      this.coder = '';
    }
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
}

export default Bot;
