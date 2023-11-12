class StatusMess {
    protected statusMess: any;

    constructor() {
        enum status {
            Success = "Success",
            BadRequest = "Fail",
        };

        this.statusMess = status;
    }

    public getStatus(): any {
        return this.statusMess;
    }
}

const statusObj = new StatusMess();
const statusMess = statusObj.getStatus();

export default statusMess;