export interface Application {
    execute(input: any): Promise<any>;
}
