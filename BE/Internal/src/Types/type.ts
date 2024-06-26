const TYPES = {
    // IClientController: Symbol.for("IClientController"),
    // IClientService: Symbol.for("IClientService"),

    IBaseRepository: Symbol.for("IBaseRepository"),
    IClientRepository: Symbol.for("IClientRepository"),
    IOrderRepository: Symbol.for("IOrderRepository"),
    IOrderItemRepository: Symbol.for("IOrderItemRepository"),
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
    IPos_notificationRepository: Symbol.for("IPos_notificationRepository"),
    IClientHistoryRepository: Symbol.for("IClientHistoryRepository"),
    ISubscriberRepository: Symbol.for("ISubscriberRepository"),
    ICampaignRepository: Symbol.for("ICampaignReposittory"),
    ITargetListRepository: Symbol.for("ITargetListRepository"),  
    IEmailCampaignRepository: Symbol.for("IEmailCampaignRepository"),
    ITrackUrlRepository: Symbol.for("ITrackUrlRepository"),
    IGroupRepository: Symbol.for("IGroupRepository")

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
    by: string | string [];
  };
  paginate?: {
    page: number;
    pageSize: number;
  };
  type?: string;
  associations?: string[] 
};

type ChartQueryOptions = {
    type: string | "DAILY" | "MONTHLY" | "YEARLY" | "CUSTOM",
    beginDate?: Date,
    endDate?: Date
}

type FilterCondition = {
  value: string | number;  // hoặc có thể sử dụng union type nếu giá trị có thể là nhiều kiểu khác nhau
  op: string | "gt" | "lt" | "gte" | "lte";
};

type RegularFilter = Record<string, string>;

export { TYPES, QueryOptions, Filter, FilterCondition, RegularFilter, ChartQueryOptions };