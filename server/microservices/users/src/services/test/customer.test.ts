//FOr testing Service
// Testing Service Methods
// What to Test: The business logic and data layer interactions (e.g., database queries, external API calls).
// How to Test: Mock dependencies (e.g., CustomerModel) and verify that the service methods behave as expected.
// Example: Testing createCustomer to ensure it correctly creates a user in the database.

import { CustomerModel } from '@users/models/customer';
import { CustomerDocumentInterface } from '@veckovn/growvia-shared';
import { 
    getCustomerByUsername, 
    getCustomerByEmail, 
    updateCustomerDataByID, 
    updateCustomerWishlist, 
    updateCustomerSavedFarmers
} from '@users/services/customer';


//Just mock DB layers(CustomerModel functions)
jest.mock('@users/models/customer', () => ({
    CustomerModel: {
        //findOne().exec -> CustomerModel.findOne mock is not properly set up to return an object with an exec function
        // findOne: jest.fn(),
        findOne: jest.fn().mockReturnValue({
            exec: jest.fn(),
        }),
        // create: jest.fn(),
        findOneAndUpdate: jest.fn(),
        updateOne: jest.fn().mockReturnValue({ //because the updateOne is called with .exec
            exec: jest.fn(),
        }),
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

describe('updateCustomerDataByID', () => {
    const mockCustomerID = '67ab171a53bc80962a3686fd';
    const mockUpdateData:CustomerDocumentInterface = {
        username:"newUsername",
        location:{
            country: "Serbia",
            city: "Belgrade",
            address: "Brace Jerkovic 11"
        }
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update customer data by ID', async () => {
        (CustomerModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdateData);
        const result = await updateCustomerDataByID(mockCustomerID, mockUpdateData);
        expect(CustomerModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: mockCustomerID },
            { $set: mockUpdateData },
            { new:true }
        );
        expect(result).toEqual(mockUpdateData);
    })

    it("should return null if customer isn't found ", async() => {
        (CustomerModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
        const result = await updateCustomerDataByID('noexistID', mockUpdateData); 
        expect(result).toBeNull();
    })
})

describe('updateCustomerWishlist and updateCustomerWishlist', () => {
    const mockCustomerID ='customer123';
    const mockProductID ='product123';
    const mockFarmerID ='farmer123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a product to a wishlish', async () =>{
        //not returning any value, just calling the method
        await updateCustomerWishlist(mockCustomerID, mockProductID, 'add');
        expect(CustomerModel.updateOne).toHaveBeenCalledWith(
            { _id: mockCustomerID },
            { $addToSet: { wishlist: mockProductID } }
        )
    })

    it('should remove a product from the wishlist', async() => {
        await updateCustomerWishlist(mockCustomerID, mockProductID, 'remove');
        expect(CustomerModel.updateOne).toHaveBeenCalledWith(
            { _id: mockCustomerID },
            { $pull: { wishlist: mockProductID } }
        )
    })

    it('should add a farmer to the saved list', async () => {
        await updateCustomerSavedFarmers(mockCustomerID, mockFarmerID, 'add');
        expect(CustomerModel.updateOne).toHaveBeenCalledWith(
            { _id: mockCustomerID },
            { $addToSet: { savedFarmes: mockFarmerID } }
        )
    })

    it('should remove a farmer from the saved list', async () => {
        await updateCustomerSavedFarmers(mockCustomerID, mockFarmerID, 'remove');
        expect(CustomerModel.updateOne).toHaveBeenCalledWith(
            { _id: mockCustomerID },
            { $pull: { savedFarmes: mockFarmerID } }
        )
    })
})