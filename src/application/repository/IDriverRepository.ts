import { Driver } from "@/domain/entity/Driver";

export interface IDriverRepository {
    save(driver: Driver): Promise<void>;
    getByPlate(plate: string): Promise<Driver | undefined>;
    getByCpf(cpf: string): Promise<Driver>;
}
