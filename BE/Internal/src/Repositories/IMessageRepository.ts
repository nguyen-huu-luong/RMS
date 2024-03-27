import Message from "../Models/Message";
import { IBaseRepository } from "./IBaseRepository";

export interface IMessageRepository extends IBaseRepository<Message> {  
}

