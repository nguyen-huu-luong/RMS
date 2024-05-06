import { container } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IMessageTemplateRepository } from "../Repositories";
import { ITargetListRepository } from "../Repositories/ITargetListRepository";
import { InternalServerError, ValidationError } from "../Errors";


export type TargelistData = {
    name: string,
    description: string,
    clients: {
        action: string,
        ids: number[]
    },
    clientIds?: number[] 
}
export class TargetListService {
    constructor(
        private targetListRepository = container.get<ITargetListRepository>(
            TYPES.ITargetListRepository
        )
    ) { }

    public async getAll(options?: QueryOptions) {
        return await this.targetListRepository.all(options);
    }

    public async getById(id: number) {
        const targetList = await this.targetListRepository.findById(id);

       return this.groupDataToReturn(targetList) ;
        
    }

    public async create(data: TargelistData) {
        const result = await this.targetListRepository.create(data);

        return result ;
    }

    public async update(id: number, data: TargelistData) {
        if (data.clients) {
            // validate actions
            if (!["add", "remove", "replace"].includes(data.clients.action)) {
                throw new ValidationError(
                    "Invalid params clients.action. Allow action in ['add', 'remove', 'replace']"
                );
            }
        }
        console.log(data, id);
        const newTargetlist = await this.targetListRepository.update(id, data);
        return this.groupDataToReturn(newTargetlist)
    }

    public async delete(id: number) {
        const result = await this.targetListRepository.delete(id);
        return result;
    }

    public async deleteMany(ids: number[]) {
        for (let id of ids) {
            console.log(id);
            await this.delete(id);
        }

        return true;
    }


    private groupDataToReturn = (targetlist:  any) => {
        const { Clients, ...rest } = JSON.parse(JSON.stringify(targetlist));
        const groupedData = Clients.reduce((acc:any, client:any) => {
            const group = client.type === 'Lead' ? 'leads' : 'customers';
            if (!acc[group]) {
              acc[group] = [];
            }
            acc[group].push(client);
            return acc;
          }, {leads: [], customers: []});
        
        let numLeads = groupedData.leads.length
        let numCustomers = groupedData.customers.length
        const count = {
            total: numLeads + numCustomers,
            leads: numLeads,
            customers: numCustomers
        }

        return {...rest, ...groupedData, count}
    }
}
