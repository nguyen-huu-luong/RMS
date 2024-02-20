import { FindOptions, Model, ModelStatic, Sequelize } from "sequelize";
import { IBaseRepository } from "../IBaseRepository";
import { injectable, unmanaged } from "inversify";
import { Filter, QueryOptions } from "../../Types/type";
import { RecordNotFoundError } from "../../Errors";

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

	public async all(options?: QueryOptions): Promise<any> {

		if (options) {
			const page = options.paginate?.page || 1
			const limit = options.paginate?.pageSize || this.DEFAULT_PAGE_SIZE
			const offset = (page - 1) * limit
			const findOptions: FindOptions = {
				// attributes: ['*'],
				limit,
				offset,
				order:  [
					[options.sort?.by || "id", options.sort?.order.toLocaleUpperCase() || "ASC"]
				]
			}

			if (this.attributes[0] != "*") {
				findOptions.attributes = this.attributes
			}
			const { count, rows } = await this._model.findAndCountAll(findOptions);

			return {
				data: rows,
				totalCount: count,
				page: options.paginate?.page,
				pageSize: options.paginate?.pageSize,
				sortedBy: options.sort?.by || "id"
			}
		}
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

		throw new RecordNotFoundError();
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

