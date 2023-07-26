import { IPassengerRepository } from "@/application/repository/IPassengerRepository";
import { knex_connection } from "@/database/knex";
import { Driver } from "@/domain/entity/Driver";
import { Passenger } from "@/domain/entity/Passenger";
import { Knex } from "knex";

export class PassengerRepositoryDatabase implements IPassengerRepository {
    connection: Knex;
    constructor() {
        this.connection = knex_connection;
    }

    async save(passenger: Passenger): Promise<void> {
        await this.connection("passenger").insert({
            id: passenger.id,
            passenger_name: passenger.name,
            password: passenger.password.getValue(),
            email: passenger.email.value,
            salt: passenger.password.salt,
            age: passenger.age.getValue(),
            cpf: passenger.cpf.getValeu(),
        });
    }

    async getByDocument(document: string): Promise<Passenger | undefined> {
        const [passengerData] = await this.connection("passenger").where({ cpf: document });

        if (!passengerData) return undefined;

        return Passenger.recreate(
            passengerData.id,
            passengerData.passenger_name,
            passengerData.email,
            passengerData.password,
            passengerData.salt,
            passengerData.age,
            passengerData.cpf
        );
    }
    async getByEmail(email: string): Promise<Passenger> {
        const [passengerData] = await this.connection("passenger").where({ email });
        if (!passengerData) throw new Error("Passenger not found");

        return Passenger.recreate(
            passengerData.id,
            passengerData.passenger_name,
            passengerData.email,
            passengerData.password,
            passengerData.salt,
            passengerData.age,
            passengerData.cpf
        );
    }

    async close(): Promise<void> {
        await this.connection.destroy();
    }
}
