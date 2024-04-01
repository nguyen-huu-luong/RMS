import { Router } from "express";
import TrackingController from "../Controllers/TrackingController";

class TrackingRouter {
    protected trackingControlller : TrackingController;
    constructor() {
        this.trackingControlller = new TrackingController()
    } 
    
    public initialize(router: Router) {
        // const trackingRouter  = Router()
        router.get("/track/email", this.trackingControlller.trackEmail.bind(this.trackingControlller));
        router.get("/track/url", this.trackingControlller.trackUrl.bind(this.trackingControlller));
       
    }
}

export default TrackingRouter ;