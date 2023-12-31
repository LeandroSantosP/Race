import { Passenger } from "@/domain/entity/Passenger";

export interface IPassengerRepository {
    save(passenger: Passenger): Promise<void>;
    getByDocument(document: string): Promise<Passenger | undefined>;
    getByEmail(email: string): Promise<Passenger>;
    close(): Promise<void>;
}
