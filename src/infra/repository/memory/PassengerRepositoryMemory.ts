import { IPassengerRepository } from "@/application/repository/IPassengerRepository";
import { Passenger } from "@/domain/entity/Passenger";

export class PassengerRepositoryMemory implements IPassengerRepository {
    passengers: Passenger[] = [];
    async save(passenger: Passenger): Promise<void> {
        this.passengers.push(passenger);
    }
    async getByDocument(cpf: string): Promise<Passenger | undefined> {
        return this.passengers.find((passenger) => passenger.cpf.getValeu() === cpf);
    }
    async getByEmail(email: string): Promise<Passenger> {
        const passenger = this.passengers.find((passenger) => passenger.email.value === email);
        if (!passenger) throw new Error("Passenger not found.");
        return passenger;
    }

    async close(): Promise<void> {}
}
