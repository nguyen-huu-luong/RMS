import Customer from "../../Models/Client";
import message from "../../Utils/Message";
import { injectable } from "inversify";
import "reflect-metadata";
import { BaseRepository } from "./BaseRepository";
import { Employee } from "../../Models";
import { IEmployeeRepository } from "../IEmployeeRepository";

@injectable()
export class EmployeeRepository extends BaseRepository<Employee> implements IEmployeeRepository {
    constructor() {
        super(Employee);
    }

    public async findByUsername(username: string) {
        return await this._model.findOne({where: {username}})
    }

    
}
