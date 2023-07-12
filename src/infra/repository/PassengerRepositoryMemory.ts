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
}
