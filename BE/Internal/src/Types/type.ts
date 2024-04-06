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

};

type FilterCondition = {
    value: string | number;  // hoặc có thể sử dụng union type nếu giá trị có thể là nhiều kiểu khác nhau
    op: string | "gt"| "lt"| "gte" | "lte";
};

type RegularFilter = Record<string, string>;

type Filter = {
    [key: string]: FilterCondition[] | string;
};


type QueryOptions = {
    filter: Filter,
    sort?: {
        order: "asc" | "desc",
        by: string
    },
    paginate?: {
        page: number,
        pageSize: number
    }
}

export { TYPES, QueryOptions, Filter, FilterCondition, RegularFilter };
