import fs, {exists} from 'fs';
import {Endpoint} from './Endpoint';
import {Logger} from '@mazemasterjs/logger';
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
    constructor(serviceFile: string) {
        this.name = '';
        this.baseUrl = '';
        this.endpoints = new Array<Endpoint>();

        if (serviceFile == undefined || serviceFile == '') {
            let err = new Error('ILLEGAL ARGUMENT: serviceFile cannot be empty.');
            Logger.getInstance().error(__filename, `constructor(${serviceFile})`, ``, err);
            throw err;
        }

        if (!fs.existsSync(serviceFile)) {
            let err = new Error(`FILE NOT FOUND: ${serviceFile}`);
            Logger.getInstance().error(__filename, `constructor(${serviceFile})`, ``, err);
            throw err;
        }

        this.loadServiceData(serviceFile);
    }

    /**
     * Attempts to read the service document (JSON) from the given file name/path.
     *
     * @param serviceFile - File name and path to the service document (JSON) data file.
     */
    private loadServiceData(serviceFile: string) {
        let svcData: any;

        try {
            svcData = JSON.parse(fs.readFileSync(serviceFile, {encoding: 'utf8'}));
            log.debug(__filename, `loadServiceData(${serviceFile})`, `JSON file parsed, Service.Name=${svcData.name}`);

            if (svcData != undefined) {
                this.name = svcData.name;
                this.baseUrl = svcData.baseUrl;

                for (let epPos = 0; epPos < svcData.endpoints.length; epPos++) {
                    let newEp: Endpoint = new Endpoint(svcData.endpoints[epPos]);

                    for (let argPos = 0; argPos < svcData.endpoints[epPos].arguments.length; argPos++) {
                        newEp.addArgument(new Argument(svcData.endpoints[epPos].arguments[argPos]));
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

    public addEndpoint(endpoint: Endpoint) {
        this.endpoints.push(endpoint);
    }

    public getEndpointByName(name: string): any {
        for (let pos = 0; pos < this.Endpoints.length; pos++) {
            let ep: Endpoint = this.Endpoints[pos];
            log.trace(__filename, `getEndpointByName('${name}')`, 'Checking EP: ' + ep.Name);
            if (ep.Name == name) {
                log.debug(__filename, `getEndpointByName('${name}')`, 'Endpoint found, returning.');
                return ep;
            }
        }

        log.warn(__filename, `getEndpointByName('${name})'`, 'Endpoint not found, returning null.');
        return null;
    }
}

export default Service;