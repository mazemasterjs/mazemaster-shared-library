/**
 * Team is an individual code-camp team that includes a collection of Bots
 */
import { Bot } from './Bot';
import { IBot } from './Interfaces/IBot';
import { ObjectBase } from './ObjectBase';

export class Team extends ObjectBase {
  private name: string;
  private id: string;
  private logo: string;
  private bots: Array<Bot>;

  constructor(data?: Team) {
    super();

    if (data !== undefined) {
      this.id = this.validateDataField('id', data.id, 'string');
      this.name = this.validateDataField('name', data.name, 'string');
      this.logo = this.validateDataField('logo', data.logo, 'string');
      this.bots = this.loadBotsArray(this.validateDataField('bots', data.bots, 'array'));
    } else {
      this.id = this.generateId();
      this.name = '';
      this.logo = '';
      this.bots = new Array<Bot>();
    }
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
