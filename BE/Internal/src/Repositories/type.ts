const TYPES = {
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
    IChannelRepository: Symbol.for("IChannelRepository"),
    IMessageRepository: Symbol.for("IMessageRepository"),
    IFloorRepository: Symbol.for("IFloorRepository"),
    ITableRepository: Symbol.for("ITableRepository"),
    IReservationRepository: Symbol.for("IReservationRepository"),
    ITableReservationRepository: Symbol.for("ITableReservationRepository"),
    IClientHistoryRepository: Symbol.for("IClientHistoryRepository"),
    ISubscriberRepository: Symbol.for("ISubscriberRepository"),
};

export { TYPES };
