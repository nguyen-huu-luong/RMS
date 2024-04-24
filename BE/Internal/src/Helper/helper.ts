import { Request } from "express";
import { ForbiddenError, ValidationError } from "../Errors";
import { QueryOptions } from "../Types/type";
import { validationResult } from "express-validator";
import { Op } from "sequelize";

/*
return object like:
ueryOptions: QueryOptions = {
        filter: {
            key: string,
            key: {
                <cond>: value
            }
        },
        sort: { by: "", order: "asc" },
        paginate: { page: 1, pageSize: 10 },
    };

*/

function parseRequesQueries(query: any): QueryOptions {
    const queryOptions: QueryOptions = {
        filter: {},
        sort: { by: "", order: "asc" },
        paginate: { page: 1, pageSize: 10 },
        // type: "",
    };

    const { page, pageSize, sort, order, ...filterOptions } = query;

    if (sort) {
        queryOptions.sort = { order: order || "asc", by: sort };
    }

    if (page && pageSize) {
        queryOptions.paginate = { page, pageSize };
    }

    // if (type) {
    //     queryOptions.type = type;
    // }

    console.log(filterOptions);
    for (const key in filterOptions) {
        console.log(key);
        if (filterOptions[key]) {
            if (typeof key === "string") {
                const filterConditions = key.split("_");
                const allowConds = [
                    "gt",
                    "lt",
                    "gte",
                    "lte",
                    "neq",
                    "like",
                    "notLike",
                    "startsWith",
                    "endsWith",
                    "contains",
                    "in",
                ];
                // filterConditions format: [<field name>, <query cond>]
                if (filterConditions.length === 2 ) {
                    console.log(filterConditions,filterOptions[key])
                    // Xử lý khi có thêm điều kiện query (format <field>_<query cond>= <value>)
                    if (allowConds.includes(filterConditions[1])) { 
                        if (!queryOptions.filter[filterConditions[0]]) {
                            queryOptions.filter[filterConditions[0]] = {}
                        }
                        if (filterConditions[1] === "in") {
                            queryOptions.filter[filterConditions[0]][filterConditions[1]] = filterOptions[key].split(";")
                        } else {
                            queryOptions.filter[filterConditions[0]][filterConditions[1]] = filterOptions[key]
                        }
                    }
                } else {
                    // Xử lý khi không có thêm điều kiện (tương ứng với filter <key>=<value>)
                    queryOptions.filter[key] = filterOptions[key];
                }

            } else {
              queryOptions.filter = {...queryOptions.filter, ...filterOptions.filter}   
            }   
        }
    }

    console.log("Parse quẻy", queryOptions);

    return queryOptions;
}

export function ensurePermissionIsValid(
    inputAction: string,
    expectedAction: string | string[]
) {
    const compare = (a: string, b: string) => a === b;
    if (typeof expectedAction === "string") {
        if (compare(inputAction, expectedAction)) {
            return true;
        }
    } else {
        for (let action of expectedAction) {
            if (!compare(inputAction, action)) {
                break;
            }
        }

        return true;
    }

    throw new ForbiddenError();
}

export function ensureDataIsValidated(req: Request) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(errors.array()[0].msg);
    }
}

export { parseRequesQueries };
