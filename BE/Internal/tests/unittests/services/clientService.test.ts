import { ClientService } from "../../../src/Services";
import { IClientRepository } from "../../../src/Repositories";
import { container } from "../../../src/Configs";
import { QueryOptions, TYPES } from "../../../src/Types/type";

describe("Test Client Service", () => {
    let clientService: ClientService;
    let mockGetAllMethod: jest.Mock;
    let mockClientRepository: Partial<IClientRepository> 

    beforeEach(() => {
        mockClientRepository = {
            all: jest.fn()
        };

        container
            .rebind<IClientRepository>(TYPES.IClientRepository)
            .toConstantValue(mockClientRepository as IClientRepository);

        clientService = container.resolve(ClientService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Test getAll method", async () => {
        // arrage
        const options = {filter: {age: {
            gt: 30
        }}} as QueryOptions
        const expectedOutput =  {data: 'some data'}

        // Act
        const result = await clientService.getAll(options)
        
        // assert
        expect(mockClientRepository.all).toHaveBeenCalledWith(options);
        expect(result).toEqual(expectedOutput)
    })  
});
