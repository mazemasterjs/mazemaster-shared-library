import { Argument } from './Argument';

/**
 * Endpoint contains data and arguments that describe a simple service endpoint
 * This class is referenced by the Service class and contains data loaded from the
 * service.json file.
 */
export class Endpoint {
  private name: string;
  private description: string;
  private method: string;
  private contentType: string;
  private url: string;
  private arguments: Argument[];

  /**
   *
   * @param data Instance of the Endpoint class loaded from JSON Data (service.json)
   */
  constructor(data: any) {
    this.name = data.name;
    this.description = data.description;
    this.method = data.method;
    this.contentType = data.contentType;
    this.url = data.url;
    this.arguments = new Array<Argument>();
  }

  public get Name(): string {
    return this.name;
  }

  public get Description(): string {
    return this.description;
  }

  public get Method(): string {
    return this.method;
  }

  public get ContentType(): string {
    return this.contentType;
  }

  public get Url(): string {
    return this.url;
  }

  public get Arguments(): Argument[] {
    return this.arguments;
  }

  public addArgument(arg: Argument) {
    this.arguments.push(arg);
  }
}

export default Endpoint;
