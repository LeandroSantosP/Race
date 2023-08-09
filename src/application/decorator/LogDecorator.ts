import { Application } from "../interfaces/Application";

export class LodDecorator {
    constructor(private readonly usecase: Application) {}

    async execute(input: any): Promise<any> {
        console.log("Input request: ", input);
        console.log(new Date());
        const usecase_output = await this.usecase.execute(input);
        console.log(new Date());
        return usecase_output;
    }
}
