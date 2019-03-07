/**
 * The Argument class is used by Endpoint - holds a list of arguments
 *
 */
export class Argument {
    public name: string;
    public description: string;
    public type: string;

    /**
     *
     * @param data Instance of the Argument class loaded from JSON Data (service.json)
     */
    constructor(data: Argument) {
        this.name = data.name;
        this.description = data.description;
        this.type = data.type;
    }
}

export default Argument;
