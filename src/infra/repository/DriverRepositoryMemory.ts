import { IDriverRepository } from "@/application/repository/IDriverRepository";
import { Driver } from "@/domain/entity/Driver";

export class DriverRepositoryMemory implements IDriverRepository {
    drivers: Driver[];

    constructor() {
        this.drivers = [];
    }

    async save(driver: Driver): Promise<void> {
        this.drivers.push(driver);
    }
    async getByPlate(plate: string): Promise<Driver | undefined> {
        return this.drivers.find((driver) => driver.plate_car.getValue() === plate);
    }

    async getByCpf(cpf: string): Promise<Driver> {
        const driver = this.drivers.find((driver) => driver.cpf.getValeu() === cpf);

        if (!driver) throw new Error("Driver not found");

        return driver;
    }
}
