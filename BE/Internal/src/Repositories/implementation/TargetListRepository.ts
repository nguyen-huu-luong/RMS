import { injectable } from "inversify";
import "reflect-metadata";
import { IMessageRepository } from "../IMessageRepository";
import { BaseRepository } from "./BaseRepository";
import Message from "../../Models/Message";
import TargetList from "../../Models/Targetlist";
import { ITargetListRepository } from "../ITargetListRepository";
import { CustomError, RecordNotFoundError } from "../../Errors";
import { Client } from "../../Models";
import { sequelize } from "../../Configs";
import { Transaction } from "sequelize";
import { TargelistData } from "../../Services/TargetList.service";
import { ErrorName } from "../../Constants";

@injectable()
export class TargetListRepository
	extends BaseRepository<TargetList>
	implements ITargetListRepository
{
	constructor() {
		super(TargetList);
	}

	public async getIds(): Promise<number[]> {
		const results = await this._model.findAll({attributes: ["id"]})
		return results.map((result: any) => result.id);
	}

	public async findById(id: number, attributes?: string[]): Promise<TargetList> {
		const targetList = await this._model.findByPk(id, {
			include: { model: Client, as: "Clients" },
		});

		if (!targetList) {
			throw new RecordNotFoundError();
		}

		return targetList;
	}

	public async create(data: any) {
		const t = await sequelize.getSequelize().transaction()
		try {
			const {name, description, clientIds} = data
			let result = await this._model.create({name, description}, {transaction: t}) ; 
			if (clientIds) {
				await result.addClients(clientIds, {transaction: t})
			}
			await t.commit()
			return result ;
		} catch (error: any) {
			await t.rollback()
			if (error.name === "SequelizeForeignKeyConstraintError") {
				throw new CustomError(400, ErrorName.BAD_REQUEST, "Some customer or lead not found in the system")
			} 
			throw error
		}
	}

	public async update(id: number, data: TargelistData): Promise<TargetList> {
		console.log("update api", data)
		const t = await sequelize.getSequelize().transaction();
		try {
			let targetlist = await this.findById(id) ;
			const {clients, ...targetlistInfo} = data ;
			if (clients) {
				await this.updateClientsInTargetlist(targetlist, clients.action , clients.ids,  t );
			}

			targetlist = await targetlist.update(targetlistInfo, {transaction: t});
			targetlist = await targetlist.reload({transaction: t})
			await t.commit()
	
			return JSON.parse(JSON.stringify(targetlist))
		} catch (error) {
			await t.rollback() 
			console.log(error)
			
			throw error
		}
    }
	

	private async updateClientsInTargetlist(targetlistInstance: TargetList, action: string, ids: number[], t?: Transaction) {
		if (action === "add") {
			console.log("add target list to campaign")
			await targetlistInstance.addClients(ids, {transaction: t})
		} else if (action === "remove") {
			await targetlistInstance.removeClients(ids, {transaction: t})
		} else if (action === "replace") {
			await targetlistInstance.removeClients(ids, {transaction: t})
		}
	}






}
