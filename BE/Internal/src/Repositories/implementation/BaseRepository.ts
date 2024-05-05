import { FindOptions, Model, ModelStatic, Op, Sequelize, where } from "sequelize";
import { IBaseRepository } from "../IBaseRepository";
import { injectable, unmanaged } from "inversify";
import { Filter, FilterObject, QueryOptions } from "../../Types/type";
import { BadRequestError, RecordNotFoundError } from "../../Errors";
import { sequelize } from "../../Configs";

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
            let allowedAttributes = this.attributes ;

            if (this.attributes[0] === '*') {
                allowedAttributes = Object.keys(this._model.getAttributes());
            }
          
            // const type = options.type ? options.type : "";


            let orderFields = ["id"] ; // default sort by id

            // sort by 1 field
            if (options.sort && typeof options.sort.by === "string") {
                orderFields = [(allowedAttributes.includes(options.sort.by) && options.sort.by) || "id"] ;
            } else if (options.sort && typeof options.sort.by === "object") { 
            // Multiple sort 
                orderFields = options.sort.by
            }
            
            const findOptions: FindOptions = {
                // attributes: ['*'],
                limit,
                offset,
                order: [
                    [
                       orderFields.join(","),
                        options.sort?.order.toLocaleUpperCase() || "ASC",
                    ],
                ],
            };

            console.log(findOptions.order)

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
          let allowAttributes = this.attributes
          if (this.attributes[0] === "*") {
            console.log("Allow all attributes")
            allowAttributes = Object.keys(this._model.getAttributes())
          }

          console.log("Allow attributes", allowAttributes, this._model.getAttributes())
          if (filter.hasOwnProperty(filterName) && allowAttributes.includes(filterName)) {
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
