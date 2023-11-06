import { Request, Response } from 'express';

class Message {
    public preProcess(req: Request, status: number): string {
        const url: string = req.url;
        const method: string = req.method;
        const host: string = req.headers.host as string;
        const currentDate: Date = new Date()
        let currentTime: string = currentDate.toTimeString()
        const pos: number = currentTime.indexOf('GMT')

        currentTime = currentTime.substring(0, pos - 1);
        
        const result: string = `${currentTime} | ${method} ${url} ${host} | ${status}`;

        return result;
    }

    public logMessage(req: Request, status: number) {
        const result: String = this.preProcess(req, status);
        console.log(result);
    }

    public queryError(err: any) {
        console.log("Query is failed!");
        console.log(`Err: ${err}`);
    }
}

const message = new Message();

export default message;