import { Age } from "../VO/Age";
import { Cpf } from "../VO/Cpf";

export class User {
    protected constructor(readonly id: string, readonly name: string, readonly age: Age, readonly cpf: Cpf) {}
}
