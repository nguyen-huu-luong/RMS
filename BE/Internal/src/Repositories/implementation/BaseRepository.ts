import { FindOptions, Model, ModelStatic, Op, Order, OrderItem, Sequelize, where } from "sequelize";
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
    DEFAULT_ORDER = "ASC";
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
            const sortOrder = options.sort?.order.toUpperCase() || this.DEFAULT_ORDER
            let allowedAttributes = this.attributes ;

            if (this.attributes[0] === '*') {
                allowedAttributes = Object.keys(this._model.getAttributes());
            }
          
            // const type = options.type ? options.type : "";


            let orderFields: [string, string][] = [] ; // default sort by id

            // // sort by 1 field
            if (options.sort?.by && typeof options.sort.by === "string") {
                orderFields.push([options.sort.by, options.sort.order.toLocaleUpperCase()])
            } else if (options.sort?.by && typeof options.sort.by === "object") { 
            // Multiple sort 
                let temp = options.sort.by.map((item:string) => ([item, sortOrder] as [string, string]))
                orderFields.push(...temp)
            }
            
            const findOptions: FindOptions = {
                // attributes: ['*'],
                limit,
                offset,
                order: orderFields.length > 0 ? [...orderFields]: [["id", "ASC"]],
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
            return await resource.update(data);
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

        //   console.log("Allow attributes", allowAttributes, this._model.getAttributes())
          if (filter.hasOwnProperty(filterName) && allowAttributes.includes(filterName)) {
            const filterConditions = filter[filterName];
            if (typeof filterConditions === "string") {
                sequelizeFilter[filterName] = filterConditions
            } else {
                for (const operator in filterConditions) {
                  const value = (filterConditions as any)[operator];
                //   console.log(operator, value);
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
