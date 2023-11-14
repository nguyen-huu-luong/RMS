import { Employee } from "../Models";
import { IBaseRepository } from "./IBaseRepository";

export interface IEmployeeRepository extends IBaseRepository<Employee> {
    findByUsername(username : string) : Promise<Employee | null> ;
}