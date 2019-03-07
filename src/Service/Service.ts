import fs from 'fs';
import {Endpoint} from './Endpoint';
import {Logger} from '@mazemasterjs/logger';

/**
 * Service class loads and wraps the service.json file - currently just for self-documentation,
 * but may be useful for test automation and service discovery at some point in the future.
 */
export class Service {
    public name: string;
    public baseUrl: string;
    public endpoints: Array<Endpoint>;

    /**
     *
     * @param serviceFile Path and filename of the service.json file to load
     */
    constructor(serviceFile: string) {
        this.name = '';
        this.baseUrl = '';
        this.endpoints = new Array<Endpoint>();

        if (serviceFile != '') {
            this.loadServiceData(serviceFile);
        }
    }

    /**
     * Attempts to read the service document (JSON) from the given file name/path.
     *
     * @param serviceFile - File name and path to the service document (JSON) data file.
     */
    private loadServiceData(serviceFile: string) {
        // grab a reference to the logger
        let log = Logger.getInstance();

        try {
            let svcData: any = JSON.parse(fs.readFileSync(serviceFile, {encoding: 'utf8'}));
            this.name = svcData.name;
            this.baseUrl = svcData.baseUrl;
            this.endpoints = svcData.endpoints;

            console.log('EPA: ' + this.endpoints[0].arguments);

            log.debug(__filename, `loadServiceData(${serviceFile})`, `Read and parsed file -> ${serviceFile}, Service Name: ${svcData.name}`);
        } catch (err) {
            log.error(__filename, `loadServiceData(${serviceFile})`, `Unable to read or parse file -> ${serviceFile}`, err);
        }
    }
}

export default Service;
