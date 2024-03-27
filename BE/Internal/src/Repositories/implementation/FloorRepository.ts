import { injectable } from "inversify";
import "reflect-metadata";
import { IFloorRepository } from "../IFloorRepository";
import { BaseRepository } from "./BaseRepository";
import { Floor } from "../../Models";
import { Op } from "sequelize";
@injectable()
export class FloorRepository
	extends BaseRepository<Floor>
	implements IFloorRepository
{
	constructor() {
		super(Floor);
	}


	public async createFloor(floor_name: any){
		try{
			await this._model.create({
				name: floor_name,
				createdAt: new Date(),
				updatedAt: new Date,
			})
			return true
		}
		catch (err) {
			return false
		}
	}

	public async findFloor(floor_name: any) {
		let floor = await this._model.findAll({
			attributes: ['name'],
			where: {
				name: floor_name
			}
		})

		return floor
	}

	public async findOne(floor_name: any) {
		let floor = await this._model.findOne({
			where: {
				name: floor_name
			}
		})

		return floor 
	}

	public async findAllFloor() {
		let floors = await this._model.findAll({
			order: [
				['id', 'ASC']
			]
		})

		return floors
	}

	public async deleteFloor(floor_names: any) {
		try {
			await this._model.destroy({
				where: {
					name: {
						[Op.in]: floor_names
					}
				}
			})
		}
		catch (err) {
			return false
		}
	}
}
