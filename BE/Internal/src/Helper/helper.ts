import { QueryOptions, FilterCondition } from "../Types/type";

function parseRequesQueries(query: any): QueryOptions {
    const queryOptions: QueryOptions = {
        filter: {},
        sort: { by: "", order: "asc" },
        paginate: { page: 1, pageSize: 10 }, // Giá trị mặc định, thay đổi nếu cần
        type: ""
    };

    const { page, pageSize, sort, order, type, ...filterOptions } = query;

    if (sort) {
        queryOptions.sort = { order: order || "asc", by: sort };
    }

    if (page && pageSize) {
        queryOptions.paginate = { page, pageSize };
    }

    if (type) {
        queryOptions.type = type;
    }

    console.log(filterOptions)
    for (const key in filterOptions) {
        if (filterOptions[key] && typeof filterOptions[key] === "string") {
            // Kiểm tra xem key có chứa điều kiện lọc không (ví dụ: price_gt, price_lt, ...)
            const filterConditions = key.split("_");
            if (filterConditions.length === 2 && ["gt", "lt", "gte", "lte"].includes(filterConditions[1])) {
                const fieldName = filterConditions[0];
                const conditionValue = filterOptions[key]

                // Thêm điều kiện lọc vào queryOptions.filter
                if (!queryOptions.filter[fieldName]) {
                    queryOptions.filter[fieldName] = [];
                }
                const condition: FilterCondition = { value: conditionValue, op: filterConditions[1] };
                const currentFilterValue = queryOptions.filter[fieldName];

                if (Array.isArray(currentFilterValue)) {
                    currentFilterValue.push(condition);
                    queryOptions.filter[fieldName] = currentFilterValue;
                } else {
                    // Nếu giá trị không phải là mảng, bạn có thể tạo một mảng mới chứa giá trị hiện tại và condition
                    queryOptions.filter[fieldName] = [condition];
                }

            } else {
                // Đối với các cặp key-value thông thường, thêm chúng vào filter trực tiếp
                queryOptions.filter[key] = filterOptions[key];
            }
        }
    }

    console.log(queryOptions);

    return queryOptions;
}

/* 
Input: query: {
    price_gt: value,
    price_lt: value,
    price_lte: value,
    price_gte: value,

    key: value,
    key: value,
    key: value,
    key: value,
}

Output: Option: {
    filter: {
        price: 10000,
        price: {
            value: 1000,
            op: lt 
        }
    },
    sort: {
        by: "",
        order: asc 
    },
    paginate: {
        limit: number,
        page: number
    }
}

*/

export {parseRequesQueries}