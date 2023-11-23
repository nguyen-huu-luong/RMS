import { injectable } from "inversify";
import "reflect-metadata";
import { ICategoryRepository } from "../ICategoryRepository";
import { BaseRepository } from "./BaseRepository";
import Category from "../../Models/Category";

@injectable()
export class CategoryRepository
	extends BaseRepository<Category>
	implements ICategoryRepository
{
	constructor() {
		super(Category);
	}

}
