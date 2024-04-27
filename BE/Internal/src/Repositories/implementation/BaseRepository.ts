import { FindOptions, Model, ModelStatic, Op, Sequelize, where } from "sequelize";
import { IBaseRepository } from "../IBaseRepository";
import { injectable, unmanaged } from "inversify";
import { Filter, FilterObject, QueryOptions } from "../../Types/type";
import { BadRequestError, RecordNotFoundError } from "../../Errors";

@injectable()
export abstract class BaseRepository<M extends Model>
    implements IBaseRepository<M>
{
    protected _model: ModelStatic<M>;
    private attributes: string[];
    DEFAULT_PAGE_SIZE = 10;
    DEFAUTL_OFFSET = 1;
    DEFAULT_ORDER = "asc";
    constructor(
        @unmanaged() model: ModelStatic<M>,
        @unmanaged() attributes?: string[]
    ) {
        this._model = model;
        this.attributes = attributes || ["*"];
    }

    public async all(options?: QueryOptions): Promise<any> {
        if (options) {
            const page = options.paginate?.page || 1;
            const limit = options.paginate?.pageSize || this.DEFAULT_PAGE_SIZE;
            const offset = (page - 1) * limit;
          
            // const type = options.type ? options.type : "";
            
            const findOptions: FindOptions = {
                // attributes: ['*'],
                limit,
                offset,
                order: [
                    [
                        options.sort?.by || "id",
                        options.sort?.order.toLocaleUpperCase() || "ASC",
                    ],
                ],
            };

            if (options.filter) {
                const sequelizeFilterObject = this.mappingToSequelizeFilterOpject(options.filter)
                if (sequelizeFilterObject) {
                    findOptions.where = sequelizeFilterObject
                }
            }

            // if (type) {
            //     findOptions.where = { type: type };
            // }

            if (this.attributes[0] != "*") {
                findOptions.attributes = this.attributes;
            }
            
            console.log(this.attributes)
            
            const { count, rows } = await this._model.findAndCountAll(
                findOptions,
            );

            return { 
                data: rows,
                totalCount: count,
                page: options.paginate?.page,
                pageSize: options.paginate?.pageSize,
                sortedBy: options.sort?.by || "id",
            };
        } else {
            if (this.attributes[0] === "*") {
                return this._model.findAll({ order: [["id", "ASC"]] });
            }

           
            const op = "[Op.in]"
            return this._model.findAll({
                attributes: this.attributes,
                order: [["id", "ASC"]],
            });
        }
    }

    public async findById(id: number, attributes?: string[]): Promise<M> {
        const resource = await this.getById(id, attributes)
        if (resource) {
            return resource;
        }

        throw new RecordNotFoundError();
    }


    public async getById(id: number, attributes?: string[]): Promise<M | null> {
        const resource = await this._model.findByPk(id, {
            attributes,
        });

        return resource ;
    }

    public async create(data: any): Promise<M> {
        return await this._model.create(data);
    }

    public async update(id: number, data: any): Promise<M> {
        const resource = await this._model.findByPk(id);

        if (resource) {
            return resource.update(data);
        }

        throw new Error();
    }

    public async delete(id: number,  cond?: any): Promise<boolean> {
        const resource = await this.findById(id);

        if (resource) {
            await resource.destroy();
            return true;
        }

        throw new RecordNotFoundError();
    }

    private mappingToSequelizeFilterOpject(filter: FilterObject): any {
        const sequelizeFilter: any = {};
        
        for (const filterName in filter) {
          console.log(filterName);
          if (filter.hasOwnProperty(filterName)) {
            const filterConditions = filter[filterName];
            if (typeof filterConditions === "string") {
                sequelizeFilter[filterName] = filterConditions
            } else {
                for (const operator in filterConditions) {
                  const value = (filterConditions as any)[operator];
                  console.log(operator, value);
                  switch (operator) {
                        case "lt":
                        case "gt":
                        case "lte":
                        case "gte":
                        case "in":
                        case "eq":
                        case "between":
                        case "notBetween":
                        case "startsWith":
                        case "endsWith":
                            sequelizeFilter[filterName] = { ...sequelizeFilter[filterName], [Op[operator]]: value };
                            break;
                        case "contains":
                            sequelizeFilter[filterName] = { ...sequelizeFilter[filterName], [Op["substring"]]: value };
                    // Handle other operators if needed
                  }
                }
            }
          }
        }
        return sequelizeFilter;
      }
}
