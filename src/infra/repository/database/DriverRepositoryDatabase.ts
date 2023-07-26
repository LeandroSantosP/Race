import { IDriverRepository } from "@/application/repository/IDriverRepository";
import { knex_connection } from "@/database/knex";
import { Driver } from "@/domain/entity/Driver";
import { Knex } from "knex";

export class DriverRepositoryDatabase implements IDriverRepository {
    connection: Knex;
    constructor() {
        this.connection = knex_connection;
    }

    async save(driver: Driver): Promise<void> {
        await this.connection("driver").insert({
            id: driver.id,
            driver_name: driver.name,
            age: driver.age.getValue(),
            cpf: driver.cpf.getValeu(),
            plate_car: driver.plate_car.getValue(),
        });
    }
    async getByPlate(plate: string): Promise<Driver | undefined> {
        const [driverData] = await this.connection("driver").where({ plate_car: plate });

        if (!driverData) return undefined;

        return Driver.recreate(
            driverData.driver_name,
            driverData.age,
            driverData.cpf,
            driverData.plate_car,
            driverData.id
        );
    }

    async getByCpf(cpf: string): Promise<Driver> {
        const [driverData] = await this.connection("driver").where({ cpf });

        if (!driverData) throw new Error("Passenger not found");

        return Driver.recreate(
            driverData.driver_name,
            driverData.age,
            driverData.cpf,
            driverData.plate_car,
            driverData.id
        );
    }
    async close(): Promise<void> {
        await this.connection.destroy();
    }
}
