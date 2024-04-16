const TYPES = {
  // IClientController: Symbol.for("IClientController"),
  // IClientService: Symbol.for("IClientService"),

  IBaseRepository: Symbol.for("IBaseRepository"),
  IClientRepository: Symbol.for("IClientRepository"),
  IOrderRepository: Symbol.for("IOrderRepository"),
  IEmployeeRepository: Symbol.for("EmployeeRepository"),
  IPermissionRepository: Symbol.for("IPermissionRepository"),
  IProductRepository: Symbol.for("IProductRepository"),
  ICartRepository: Symbol.for("ICartRepository"),
  ITokenRepository: Symbol.for("ITokenRepository"),
  ICategoryRepository: Symbol.for("ICategoryRepository"),
  IVoucherRepository: Symbol.for("IVoucherRepository"),
  IMessageTemplateRepository: Symbol.for("IMessageTemplateRepository"),

  IMessageRepository: Symbol.for("IMessageRepository"),
  IChannelRepository: Symbol.for("IChannelRepository"),
  ITableRepository: Symbol.for("ITableRepository"),
  IFloorRepository: Symbol.for("IFloorRepository"),
  IReservationRepository: Symbol.for("IReservationRepository"),
  ITableReservationRepository: Symbol.for("ITableReservationRepository"),
  ICartItemRepository: Symbol.for("ICartItemRepository"),
  IClickEventRepository: Symbol.for("IClickEventREpository"),
  IOpenEventRepository: Symbol.for("IOpenEventRepository"),
  INotificationRepository: Symbol.for("INotificationRepository"),

  ICampaignRepository: Symbol.for("ICampaignReposittory"),
  ITargetListRepository: Symbol.for("ITargetListRepository"),
};


type Filter = {
  [key: string]: FilterObject;
};

export interface FilterObject {
  [filterName: string]: {
    eq?: any;
    neq?: any;
    not?: any;
    gt?: any;
    gte?: any;
    lt?: any;
    lte?: any;
    between?: [any, any];
    notBetween?: [any, any];
    in?: any[];
    notIn?: any[];

    like?: any[];
    notLike?: any[];
    startsWith?: any[];
    endsWith?: any[];
    substring?: any[];
    iLike?: any[];
    notILike?: any[];
  };
}

type QueryOptions = {
  filter: Filter;
  sort?: {
    order: "asc" | "desc";
    by: string;
  };
  paginate?: {
    page: number;
    pageSize: number;
  };
  type?: string;
};

export { TYPES, QueryOptions, Filter};
