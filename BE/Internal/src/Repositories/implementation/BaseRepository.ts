import { Model, ModelStatic } from "sequelize";
import { IBaseRepository } from "../IBaseRepository";
import { injectable, unmanaged } from "inversify";
import { Filter, QueryOptions } from "../../Types/type";

@injectable()
export abstract class BaseRepository<M extends Model> implements IBaseRepository<M> {
    protected _model: ModelStatic<M> ;
	private attributes: string[]
	DEFAULT_PAGE_SIZE = 10 
	DEFAUTL_OFFSET = 1 
	DEFAULT_ORDER = "asc"
	constructor(@unmanaged() model: ModelStatic<M>, @unmanaged() attributes?: string[]) {
        this._model = model
		this.attributes = attributes || ["*"] ;
    }

	public async all(options?: QueryOptions): Promise<M[]> {

		if (options) 

			return this._model.findAll({
				// attributes: this.attributes[0] && this.attributes[0] == "*" : this.attributes ,
				limit: options.paginate?.limit || this.DEFAULT_PAGE_SIZE,
				offset: options.paginate?.page || this.DEFAUTL_OFFSET,
				order:  [[options.sort?.by || "id", options.sort?.order.toLocaleUpperCase() || "ASC"]]
			});
		else 
			return this._model.findAll({ attributes: this.attributes })
	}

	public async findById(id: number, attributes?: string[]): Promise<M> {
		const resource = await this._model.findByPk(id, {
			attributes,
		});

		if (resource) {
			return resource;
		}

		throw new Error();
	}

	public async create(data: any): Promise<M> {
		return await this._model.create(data);
	}

	public async update(id: number, data: any): Promise<M> {
		const resource = await this.findById(id);

		if (resource) {
			return resource.update(data);
		}

		throw new Error();
	}

	public async delete(id: number): Promise<boolean> {
		const resource = await this.findById(id);

		if (resource) {
			await resource.destroy();
			return true;
		}

		throw new Error();
	}



	/*
	Input: filterOptions 
	Output -> Sequelize Where clause 
	{
		firstname: fadfda -> fisrtname: dfafdas
		age: {
			value: 312,
			op: "gt"
		} --> {
			age: {
				gt: 312
			}
		}
	}

	*/
	// private mappingToWhereClause(filterOptions: Filter) {
	// 	const result = {}
	// 	for (const key in filterOptions) {
	// 		if (typeof filterOptions[key] === "string") {
	// 			result[key] = filterOptions[key] ;
	// 		}
	// 	}
	// }
}

