export class Ticket {
    private value: string;
    constructor(date: Date, sequence: number) {
        this.value = `${date.getFullYear()}${sequence.toString().padStart(6, "0")}`;
    }

    getTicket() {
        return this.value;
    }
}
