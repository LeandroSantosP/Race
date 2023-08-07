import { Driver } from "@/domain/entity/Driver";
import { IDriverRepository } from "../repository/IDriverRepository";
import { Application } from "../interfaces/Application";

export class CreateDriverUsecase implements Application {
    constructor(private readonly DriverRepository: IDriverRepository) {}

    async execute(input: Input): Promise<void> {
        const driverExist = await this.DriverRepository.getByPlate(input.plate_car);
        if (driverExist) throw new Error("Driver Already Exist!");
        const driver = Driver.create(input.name, input.age, input.cpf, input.plate_car);
        await this.DriverRepository.save(driver);
    }
}

type Input = {
    name: string;
    age: number;
    cpf: string;
    plate_car: string;
};
