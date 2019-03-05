import {Argument} from './Argument';

export class Endpoint {
    public name: string;
    public description: string;
    public method: string;
    public contentType: string;
    public url: string;
    public arguments: Array<Argument>;

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
