export interface IQueue<Q, W> {
    createQueue(queueName: string): Q;
    createWorker(queueName: string, handle: (data: any) => Promise<any>, opts?: any): W;
}
