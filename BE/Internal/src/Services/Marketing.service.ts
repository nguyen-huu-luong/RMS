import { container } from "../Configs";
import { QueryOptions, TYPES } from "../Types/type";
import { IMessageTemplateRepository } from "../Repositories";

export class MarketingService {
  constructor(
    private messageTemplateRepository = container.get<IMessageTemplateRepository>(
      TYPES.IMessageTemplateRepository
    )
  ) {}

  public async getAllMessageTemplates(options?: QueryOptions) {
    return await this.messageTemplateRepository.all(options);
  }

  public async getById(id: number) {
    return await this.messageTemplateRepository.findById(id);
  }

  public async createMessageTempplate(data: any) {
    const result = this.messageTemplateRepository.create(data);
    return result;
  }

  public async update(id: number, data: any) {
    const result = this.messageTemplateRepository.update(data, id);
    return result;
  }

  public async delete(id: number) {
    const result = this.messageTemplateRepository.delete(id);
    return result;
  }
}
