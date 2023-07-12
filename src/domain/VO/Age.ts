export class Age {
    private readonly value: number;
    constructor(age: number) {
        if (age < 18) throw new Error("Driver must be greater than 18 yeas old.");
        this.value = age;
    }

    getValue() {
        return this.value;
    }
}
