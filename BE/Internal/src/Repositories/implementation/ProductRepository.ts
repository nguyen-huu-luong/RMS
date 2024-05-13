import { injectable } from "inversify";
import "reflect-metadata";
import { IProductRepository } from "../IProductRepository";
import { BaseRepository } from "./BaseRepository";
import { Product } from "../../Models";
import Token from "../../Models/Token";
import { REFRESH_TOKEN } from "../../Constants";

@injectable()
export class ProductRepository
	extends BaseRepository<Product>
	implements IProductRepository
{
	constructor() {
		super(Product);
	}

	public async findByCond(cond: any) {
		return await this._model.findAll(cond)
	}

	public async  getOne(id: number  | string) {
		return  this._model.findOne({where:  {id}})
	}

}
