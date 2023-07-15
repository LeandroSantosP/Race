export interface IGatewayPayment {
    name: string;
    createTransaction(input: Input): Promise<Output>;
}

type Input = {
    email: string;
    creditCardToken: string;
    price: number;
};

type Output = {
    tid: string;
    status: string;
};
