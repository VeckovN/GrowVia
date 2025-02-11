//FOr testing Service
// Testing Service Methods
// What to Test: The business logic and data layer interactions (e.g., database queries, external API calls).
// How to Test: Mock dependencies (e.g., CustomerModel) and verify that the service methods behave as expected.
// Example: Testing createCustomer to ensure it correctly creates a user in the database.

import { CustomerModel } from '@users/models/customer';
import { getCustomerByUsername, getCustomerByEmail } from '@users/services/customer';

//Just mock DB layers(CustomerModel functions)
jest.mock('@users/models/customer', () => ({
    CustomerModel: {
        //findOne().exec -> CustomerModel.findOne mock is not properly set up to return an object with an exec function
        // findOne: jest.fn(),
        findOne: jest.fn().mockReturnValue({
            exec: jest.fn(),
        }),

        findOneAndUpdate: jest.fn(),
        updateOne: jest.fn()
    }
}))

//Doesn't needed for testing service (db layer)
// jest.mock('@users/services/customer', () => ({
//     // createCustomer: jest.fn()
//     getCustomerByUsername: jest.fn(),
//     getCustomerByEmail: jest.fn()
// }))

describe('getCustomerByUsername and getCustomerByEmail', () => {
    const mockCustomer = {
        username: 'Dusty6476',
        email: 'victor.cronin@hotmail.com',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get a customer by username', async () => {
        //use ().exec with mockResolvedValue
        (CustomerModel.findOne().exec as jest.Mock).mockResolvedValue(mockCustomer);
        const result = await getCustomerByUsername('Dusty6476');
        expect(CustomerModel.findOne).toHaveBeenCalledWith({ username: 'Dusty6476' });
        expect(result).toEqual(mockCustomer);
    });

    it('should get a customer by email', async () => {
        (CustomerModel.findOne().exec as jest.Mock).mockResolvedValue(mockCustomer);
        const result = await getCustomerByEmail('victor.cronin@hotmail.com');
        expect(CustomerModel.findOne).toHaveBeenCalledWith({ email: 'victor.cronin@hotmail.com' });
        expect(result).toEqual(mockCustomer);
    });

    it('should return null if customer is not found', async () => {
        (CustomerModel.findOne().exec as jest.Mock).mockResolvedValue(null);
        const result = await getCustomerByUsername('nonexistent');
        expect(result).toBeNull();
    });
});
