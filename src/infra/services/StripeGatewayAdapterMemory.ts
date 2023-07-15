import { IGatewayPayment } from "@/application/service/IGatewayPayment";

export class StripeGatewayAdapterMemory implements IGatewayPayment {
    name = "stripe";
    async createTransaction(input: {
        email: string;
        creditCardToken: string;
        price: number;
    }): Promise<{ tid: string; status: string }> {
        return {
            status: "approved",
            tid: "123456789",
        };
    }
}
