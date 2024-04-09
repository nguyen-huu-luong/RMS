import  {parseRequesQueries} from "../../../src/Helper/helper";

describe("parseRequesQueries function", () => {
  it("should parse query options correctly", () => {
    const query = {
      price_gt: "10000",
      price_lt: "50000",
      name: "John",
      age: "30",
      sort: "name",
      order: "desc",
      page: "2",
      pageSize: "20"
    };

    const expectedOutput = {
      filter: {
        price: [
          { value: "10000", op: "gt" },
          { value: "50000", op: "lt" }
        ],
        name: "John",
        age: "30"
      },
      sort: { by: "name", order: "desc" },
      paginate: { page: 2, pageSize: 20 }
    };

    const result = parseRequesQueries(query);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle empty query", () => {
    const query = {};

    const expectedOutput = {
      filter: {},
      sort: { by: "", order: "asc" },
      paginate: { page: 1, pageSize: 10 }
    };

    const result = parseRequesQueries(query);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle query with only sort and order", () => {
    const query = { sort: "name", order: "asc" };

    const expectedOutput = {
      filter: {},
      sort: { by: "name", order: "asc" },
      paginate: { page: 1, pageSize: 10 }
    };

    const result = parseRequesQueries(query);

    expect(result).toEqual(expectedOutput);
  });

  // Add more test cases as needed
});