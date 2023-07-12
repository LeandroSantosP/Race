export class Plate {
    private value: string;
    constructor(plate: string) {
        const regex = /^[A-Z]{3}-\d{4}$/;

        if (!regex.test(plate)) throw new Error("Invalid Plate");

        this.value = plate;
    }

    getValue() {
        return this.value;
    }
}
