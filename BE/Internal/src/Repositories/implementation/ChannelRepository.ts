import { injectable } from "inversify";
import "reflect-metadata";
import { IChannelRepository } from "../IChannelRepository";
import { BaseRepository } from "./BaseRepository";
import Channel from "../../Models/Channel";

@injectable()
export class ChannelRepository
	extends BaseRepository<Channel>
	implements IChannelRepository
{
	constructor() {
		super(Channel);
	}

}
