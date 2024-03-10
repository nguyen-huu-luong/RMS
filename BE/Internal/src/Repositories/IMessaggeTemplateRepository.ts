import { Employee } from "../Models";
import MessageTemplate from "../Models/Messagetemplate";
import { IBaseRepository } from "./IBaseRepository";

export interface IMessageTemplateRepository extends IBaseRepository<MessageTemplate> {
}