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
            tid: "68a68ee3-6d31-4401-ba67-d5ffa89c6ebb",
        };
    }
}
