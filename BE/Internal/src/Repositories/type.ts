const TYPES = {
    IBaseRepository: Symbol.for("IBaseRepository"),
    IClientRepository: Symbol.for("IClientRepository"),
    IOrderRepository: Symbol.for("IOrderRepository"),
    IEmployeeRepository: Symbol.for("EmployeeRepository"),
    IPermissionRepository: Symbol.for("IPermissionRepository"),
    IProductRepository: Symbol.for("IProductRepository"),
    ICartRepository: Symbol.for("ICartRepository"),
    ITokenRepository: Symbol.for("ITokenRepository"),
    ICartItemRepository: Symbol.for("ICartItemRepository"),
    IOrderItemRepository: Symbol.for("IOrderItemRepository")
};

export { TYPES };
