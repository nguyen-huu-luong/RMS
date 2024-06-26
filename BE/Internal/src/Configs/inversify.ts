import { Container } from "inversify";
import {OrderRepository} from "../Repositories/implementation/OrderRepository";
import {
	IOrderRepository,
	IClientRepository,
	IEmployeeRepository,
    EmployeeRepository,
	IProductRepository,
	ICartRepository,
	IVoucherRepository,
	VoucherRepository,
    ITokenRepository,
    TokenRepository,
	MessageTemplateRepository,
	IMessageTemplateRepository,
	ChannelRepository,
	MessageRepository,
	IFloorRepository,
	ITableRepository,
	ITableReservationRepository,
	IReservationRepository,
	ICartItemRepository,
	CartItemRepository,
	INotificationRepository,
	NotificationRepository,
	ClientHistoryRepository,
	Pos_notificationRepository,
	GroupRepository,
	IGroupRepository
} from "../Repositories";
import { ClientRepository,  } from "../Repositories";
import { IPermissionRepository } from "../Repositories/IPermissionRepository";
import { PermissionRepository } from "../Repositories/implementation/PermissionRepository";
import { ProductRepository } from "../Repositories";
import { CartRepository } from "../Repositories";
import { ICategoryRepository } from "../Repositories/ICategoryRepository";
import { CategoryRepository } from "../Repositories/implementation/CategoryRepository";
import { FloorRepository, TableRepository, TableReservationRepository, ReservationRepository, } from "../Repositories";
// import { IClientService } from "../Services";
import { TYPES } from "../Types/type";
import { IChannelRepository } from "../Repositories/IChannelRepository";
import { IMessageRepository } from "../Repositories/IMessageRepository";
import { IOpenEventrRepository } from "../Repositories/IOpenEventRepository";
import { OpenEventRepository } from "../Repositories/implementation/OpenEventRepository";
import { IClickEventRepository } from "../Repositories/IClickEventRepository";
import { ClickEventRepository } from "../Repositories/implementation/ClickEventRepository";
import { ICamPaignRepository } from "../Repositories/ICampaignRepository";
import { CampaignRepository } from "../Repositories/implementation/CampaignRepository";
import { ITargetListRepository } from "../Repositories/ITargetListRepository";
import { TargetListRepository } from "../Repositories/implementation/TargetListRepository";
import { IClientHistoryRepository } from "../Repositories";
import { ISubscriberRepository, SubscriberRepository } from "../Repositories";
import { IOrderItemRepository, OrderItemRepository } from "../Repositories";
import { IEmailCampaignRepository } from "../Repositories/IEmailCampaignRepository";
import { EmailCampaignRepository } from "../Repositories/implementation/EmailCampaignRepository";
import { ITrackUrlRepository } from "../Repositories/IITrackUrlRepository";
import { TrackUrlRepository } from "../Repositories/implementation/TrackUrlRepository";

import { IPos_notificationRepository } from "../Repositories/IPos_notificationRepository";
class InversifyContainer {
	private container;
	static instance: InversifyContainer ;

	constructor() {
		if (InversifyContainer.instance) {
			throw new Error("Using InversifyContainer.getInstance() instead")
		}
		this.container = new Container();
	}

	public getContainer(): Container {
		this.register();
		return this.container;
	}

	static getInstance() {
		InversifyContainer.instance = InversifyContainer.instance || new InversifyContainer() ;
		return InversifyContainer.instance ;
	}

	public register() {
		// register repository here
		this.container.bind<IClientRepository>(TYPES.IClientRepository).to(ClientRepository);
		this.container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository);
		this.container.bind<IOrderItemRepository>(TYPES.IOrderItemRepository).to(OrderItemRepository);
		this.container.bind<IEmployeeRepository>(TYPES.IEmployeeRepository).to(EmployeeRepository);
		this.container.bind<IPermissionRepository>(TYPES.IPermissionRepository).to(PermissionRepository);
		this.container.bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository);
		this.container.bind<ICartRepository>(TYPES.ICartRepository).to(CartRepository);
		this.container.bind<ITokenRepository>(TYPES.ITokenRepository).to(TokenRepository);
		this.container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepository);
		this.container.bind<IVoucherRepository>(TYPES.IVoucherRepository).to(VoucherRepository);
		this.container.bind<IMessageTemplateRepository>(TYPES.IMessageTemplateRepository).to(MessageTemplateRepository);
		this.container.bind<IFloorRepository>(TYPES.IFloorRepository).to(FloorRepository);
		this.container.bind<ITableRepository>(TYPES.ITableRepository).to(TableRepository);
		this.container.bind<ITableReservationRepository>(TYPES.ITableReservationRepository).to(TableReservationRepository);
		this.container.bind<IReservationRepository>(TYPES.IReservationRepository).to(ReservationRepository);
		// this.container.bind<IClientService>(TYPES.IClientService).to(ClientService);

		// this.container.bind<IClientController>(TYPES.IClientController).to(ClientController)
		this.container.bind<IChannelRepository>(TYPES.IChannelRepository).to(ChannelRepository);
		this.container.bind<IMessageRepository>(TYPES.IMessageRepository).to(MessageRepository);
		this.container.bind<ICartItemRepository>(TYPES.ICartItemRepository).to(CartItemRepository);

		this.container.bind<IOpenEventrRepository>(TYPES.IOpenEventRepository).to(OpenEventRepository);
		this.container.bind<IClickEventRepository>(TYPES.IClickEventRepository).to(ClickEventRepository);
		this.container.bind<INotificationRepository>(TYPES.INotificationRepository).to(NotificationRepository)


		this.container.bind<ICamPaignRepository>(TYPES.ICampaignRepository).to(CampaignRepository);
		this.container.bind<ITargetListRepository>(TYPES.ITargetListRepository).to(TargetListRepository);
		this.container.bind<IClientHistoryRepository>(TYPES.IClientHistoryRepository).to(ClientHistoryRepository)
		this.container.bind<ISubscriberRepository>(TYPES.ISubscriberRepository).to(SubscriberRepository)
		this.container.bind<IEmailCampaignRepository>(TYPES.IEmailCampaignRepository).to(EmailCampaignRepository)
		this.container.bind<ITrackUrlRepository>(TYPES.ITrackUrlRepository).to(TrackUrlRepository)
		this.container.bind<IPos_notificationRepository>(TYPES.IPos_notificationRepository).to(Pos_notificationRepository)
		this.container.bind<IGroupRepository>(TYPES.IGroupRepository).to(GroupRepository)
	}
}

const containerObj = InversifyContainer.getInstance()
export default containerObj.getContainer();
