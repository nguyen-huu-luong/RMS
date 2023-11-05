import { Request, Response } from 'express';

class Message {
    public preProcess(req: Request, status: any): String {
        const url: any = req.url;
        const method: any = req.method;
        const host: any = req.headers.host;
        const currentDate: any = new Date()
        let currentTime: String = currentDate.toTimeString()
        const pos: any = currentTime.indexOf('GMT')

        currentTime = currentTime.substring(0, pos - 1);
        
        const result: String = `${currentTime} | ${method} ${url} ${host} | ${status}`;

        return result;
    }

    public logMessage(req: Request, status: any) {
        const result: String = this.preProcess(req, status);
        console.log(result);
    }
}

const message = new Message();

export default message;