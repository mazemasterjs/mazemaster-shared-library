import {Argument} from './Argument';

/**
 * Endpoint contains data and arguments that describe a simple service endpoint
 * This class is referenced by the Service class and contains data loaded from the
 * service.json file.
 */
export class Endpoint {
    public name: string;
    public description: string;
    public method: string;
    public contentType: string;
    public url: string;
    public arguments: Array<Argument>;

    /**
     *
     * @param data Instance of the Endpoint class loaded from JSON Data (service.json)
     */
    constructor(data: Endpoint) {
        this.name = data.name;
        this.description = data.description;
        this.method = data.method;
        this.contentType = data.contentType;
        this.url = data.url;
        this.arguments = data.arguments;
    }
}

export default Endpoint;
