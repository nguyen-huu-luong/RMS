import Customer from "../../model/Client";
import message from "../../define/message";
import { injectable } from "inversify";
import "reflect-metadata";
import { BaseRepository } from "./BaseRepository";
import { Employee } from "../../model";
import { IEmployeeRepository } from "../IEmployeeRepository";

@injectable()
export class EmployeeRepository extends BaseRepository<Employee> implements IEmployeeRepository {
    constructor() {
        super(Employee);
    }

    
}
