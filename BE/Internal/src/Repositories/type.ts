const TYPES = {
    IBaseRepository: Symbol.for("IBaseRepository"),
    IClientRepository: Symbol.for("IClientRepository"),
    IOrderRepository: Symbol.for("IOrderRepository"),
    IEmployeeRepository: Symbol.for("EmployeeRepository"),
    IPermissionRepository: Symbol.for("IPermissionRepository"),
    IProductRepository: Symbol.for("IProductRepository"),
    ICartRepository: Symbol.for("ICartRepository"),
    ITokenRepository: Symbol.for("ITokenRepository"),
    ICategoryRepository: Symbol.for("ICategoryRepository"),
    IVoucherRepository: Symbol.for("IVoucherRepository")
};

export { TYPES };
