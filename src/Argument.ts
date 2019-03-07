/**
 * The Argument class is used by Endpoint - holds a list of arguments
 *
 */
export class Argument {
    private name: string;
    private description: string;
    private type: string;

    /**
     *
     * @param data Instance of the Argument class loaded from JSON Data (service.json)
     */
    constructor(data: any) {
        this.name = data.name;
        this.description = data.description;
        this.type = data.type;
    }

    public get Name(): string {
        return this.name;
    }

    public get Description(): string {
        return this.description;
    }

    public get Type(): string {
        return this.type;
    }
}

export default Argument;
