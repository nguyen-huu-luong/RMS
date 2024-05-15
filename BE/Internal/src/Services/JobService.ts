import { Job, JobStatus } from "bull";
import { Queue } from "bullmq";
import { QUEUE_NAMES, QueueService } from "./Queue.service";

type GetJobOptions = {
    status?: JobStatus[],
    page?: number,
    pageSize?: number,
    data?: Record<string, any>
}
class JobService {

    public async getAll(queueName: QUEUE_NAMES, options?: GetJobOptions) {
        const queue = new QueueService().getQueue(queueName)
        let status: JobStatus[] = options?.status || ["active", "completed", "delayed", "failed", "paused", "waiting"]
        let page = options?.page || 1
        let pageSize = options?.pageSize || 10
        // let start = page * (pageSize - 1) 
        // let end = page * pageSize 
        const result = await queue.getJobs(status)
        
        if (options && options.data) {
            result.filter(job => {
                for (let key in Object.keys(options.data || {})) {
                    if (options.data && (job.data[key] !== options.data[key])) return false ;
                }   
                return true
            })
        }


        return result;
    }
}

export default  JobService ;