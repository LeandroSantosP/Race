import { hash, compare } from "bcrypt";

export class Password {
    private readonly value: string;
    readonly salt: number;

    constructor(password: string, salt: number) {
        this.value = password;
        this.salt = salt;
    }

    static async create(password: string, salt?: number) {
        if (password.length < 8) throw new Error("Password must be at least 8 characters long");
        const generateSalt = salt || 10;
        const passwordHashed = await hash(password, generateSalt);
        return new Password(passwordHashed, generateSalt);
    }

    async verify(PlainPassword: string): Promise<boolean> {
        return compare(PlainPassword, this.value);
    }

    getValue() {
        return this.value;
    }
}
