import { Router } from "express"
import JobController from "../Controllers/Job.controller"

class  JobRouter {
    protected jobController : JobController;
    constructor() {
        this.jobController = new JobController()
    } 
    public initialize(router: Router) {
        const jobRouter = Router()
        jobRouter.get("/all", this.jobController.getAllJob.bind(this.jobController))
        router.use("/jobs", jobRouter)
    }
}

export default JobRouter ;