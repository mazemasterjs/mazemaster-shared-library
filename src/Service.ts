import fs from 'fs';
import { Endpoint } from './Endpoint';
import { Logger } from '@mazemasterjs/logger';
import Argument from './Argument';

// grab a reference to the logger
const log = Logger.getInstance();

/**
 * Service class loads and wraps the service.json file - currently just for self-documentastion,
 * but may be useful for test automation and service discovery at some point in the future.
 */
export class Service {
  private name: string;
  private baseUrl: string;
  private endpoints: Array<Endpoint>;

  /**
   *
   * @param serviceFile Path and filename of the service.json file to load
   */
  constructor(serviceFile?: string) {
    this.name = '';
    this.baseUrl = '';
    this.endpoints = new Array<Endpoint>();

    if (serviceFile !== undefined && serviceFile !== '') {
      if (!fs || !fs.readFileSync) {
        log.warn(__filename, `loadServiceData(${serviceFile}`, 'Cannot access fs module.');
        return;
      }

      if (!fs.existsSync(serviceFile)) {
        const err = new Error(`FILE NOT FOUND: ${serviceFile}`);
        Logger.getInstance().error(__filename, `constructor(${serviceFile})`, '', err);
        throw err;
      }

      this.loadServiceData(serviceFile);
    }
  }

  /**
   * Loads the service directly from the given JSON data object
   */
  public loadFromJson(svcData: any) {
    let error: Error = new Error();

    if (typeof svcData.name !== 'string' || svcData.name.trim() === '') {
      error = new Error('Service.name must be a string.');
    }

    if (typeof svcData.baseUrl !== 'string' || svcData.baseUrl.trim() === '') {
      error = new Error('Service.baseUrl must be a string.');
    }

    if (error.message !== '') {
      log.error(__filename, `loadFromJson(${svcData})`, 'Cannot parse svcData ->', error);
      throw error;
    }

    this.name = svcData.name;
    this.baseUrl = svcData.baseUrl;
    this.endpoints = new Array<Endpoint>();

    /* istanbul ignore if */
    if (svcData.endpoints) {
      for (const ep of svcData.endpoints) {
        const newEp: Endpoint = new Endpoint(ep);
        for (const arg of ep.arguments) {
          newEp.addArgument(new Argument(arg));
        }
        this.endpoints.push(newEp);
      }
    }
  }

  public addEndpoint(endpoint: Endpoint) {
    this.endpoints.push(endpoint);
  }

  public getEndpointByName(name: string): any {
    for (const ep of this.Endpoints) {
      log.trace(__filename, `getEndpointByName('${name}')`, 'Checking EP: ' + ep.Name);
      if (ep.Name === name) {
        log.debug(__filename, `getEndpointByName('${name}')`, 'Endpoint found, returning.');
        return ep;
      }
    }

    log.warn(__filename, `getEndpointByName('${name})'`, 'Endpoint not found, returning null.');
    return null;
  }

  /**
   * Attempts to read the service document (JSON) from the given file name/path.
   *
   * @param serviceFile - File name and path to the service document (JSON) data file.
   */
  private loadServiceData(serviceFile: string) {
    let svcData: any;

    if (!fs || !fs.readFileSync) {
      log.warn(__filename, `loadServiceData(${serviceFile}`, 'Cannot access fs module.');
      return;
    }

    try {
      svcData = JSON.parse(fs.readFileSync(serviceFile, { encoding: 'utf8' }));
      log.debug(__filename, `loadServiceData(${serviceFile})`, `JSON file parsed, Service.Name=${svcData.name}`);

      if (svcData !== undefined) {
        this.name = svcData.name;
        this.baseUrl = svcData.baseUrl;

        for (const ep of svcData.endpoints) {
          const newEp: Endpoint = new Endpoint(ep);
          for (const arg of ep.arguments) {
            newEp.addArgument(new Argument(arg));
          }
          this.endpoints.push(newEp);
        }
      }
    } catch (err) {
      log.error(__filename, `loadServiceData(${serviceFile})`, `Unable parse JSON file`, err);
    }
  }

  public get Name(): string {
    return this.name;
  }

  public get BaseUrl(): string {
    return this.baseUrl;
  }

  public get Endpoints(): Array<Endpoint> {
    return this.endpoints;
  }
}

export default Service;
