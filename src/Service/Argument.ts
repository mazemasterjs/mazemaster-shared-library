export class Argument {
    public name: string;
    public description: string;
    public type: string;

    constructor(data: Argument) {
        this.name = data.name;
        this.description = data.description;
        this.type = data.type;
    }
}

export default Argument;
