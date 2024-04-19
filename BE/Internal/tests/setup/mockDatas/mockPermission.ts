let d = new Date();
export const mockPermissions = [
    { role: 'manager', resource: 'tables', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
    { role: 'manager', resource: 'tables', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
    { role: 'manager', resource: 'tables', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
    { role: 'manager', resource: 'tables', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
    { role: 'manager', resource: 'floors', action: 'read:any', attributes: '*', createdAt: d, updatedAt: d },
    { role: 'manager', resource: 'floors', action: 'update:any', attributes: '*', createdAt: d, updatedAt: d },
    { role: 'manager', resource: 'floors', action: 'create:any', attributes: '*', createdAt: d, updatedAt: d },
    { role: 'manager', resource: 'floors', action: 'delete:any', attributes: '*', createdAt: d, updatedAt: d },
]