import { IDriverRepository } from "../repository/IDriverRepository";

export class GetDriverUsecase {
    constructor(private readonly driverRepository: IDriverRepository) {}

    async execute(cpf: string): Promise<Output> {
        const driver = await this.driverRepository.getByCpf(cpf);
        const output: Output = {
            driverName: driver.name,
            plate_car: driver.plate_car.getValue(),
            age: driver.age.getValue(),
            cpf: driver.cpf.getValeu(),
        };
        return output;
    }
}

type Output = {
    driverName: string;
    age: number;
    cpf: string;
    plate_car: string;
};
