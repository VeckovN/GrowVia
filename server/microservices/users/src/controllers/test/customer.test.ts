
// Testing Controllers
// What to Test: The HTTP layer (e.g., request validation, response formatting, and error handling).

// How to Test: Mock the service methods and verify that the controller returns 
// the correct HTTP status codes and responses.

// Example: Testing getCustomerDetailsByUsername to ensure it returns a 200 status code
//  and the correct JSON response.

//Mock Dependencies
import { Request, Response} from 'express';
import { CustomerDocumentInterface } from '@veckovn/growvia-shared';
import { 
    getCustomerByEmail, 
    getCustomerByUsername, 
    updateCustomerWishlist,
    updateCustomerSavedFarmers,
    updateCustomerOrderHistory,
} from '@users/services/customer';
import { 
    getCustomerDetailsByEmail, 
    getCustomerDetailsByUsername, 
    addProductToWishlist,
    removeProductToWishlist,
    addFarmerToSavedList,
    addOrderToHistory
} from "@users/controllers/customer";

jest.mock('@users/services/customer', () =>({
   getCustomerByUsername: jest.fn(),
   getCustomerByEmail: jest.fn(),
   updateCustomerWishlist: jest.fn(),
   updateCustomerSavedFarmers: jest.fn(),
   updateCustomerOrderHistory: jest.fn(),
}))

//expected returned customer data
const mockedCustomer: CustomerDocumentInterface = {
    // id: "67ab171a53bc80962a3686fd",
    userID:'4',
    username: "Dusty6476",
    email: "victor.cronin@hotmail.com",
    fullName: "Sharon Feest",
    // profilePicture:"https://picsum.photos/seed/YnsHp/3569/3990?blur=10",
    profileAvatarFile:"https://picsum.photos/seed/YnsHp/3569/3990?blur=10",
    wishlist: [],
}

type reqTypes = string | number | Date | undefined;

const mockRequest = (options: { body?: Record<string, reqTypes>, params?: Record<string, reqTypes> }): Request => {
    return {
        body: options.body || {},
        params: options.params || {},
    } as unknown as Request;
};
const mockResponse = () =>{
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis(),
    res.json = jest.fn();
    return res;
}

describe('get Customer user by username ', () => { 
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        // req = {
        //     params: {
        //         // username: mockedCustomer.username; 
        //         username: 'Dusty6476' 
        //     }
        // } as unknown as Request; //unknown is must have due to req.params (TS) 
        req = mockRequest({
            params:{ username: 'Dusty6476' }
        })
        // res = {
        //     status: jest.fn().mockReturnThis(),
        //     json: jest.fn()
        // } as unknown as Response
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should return user date feched by username', async () =>{
        //mocking the service method to return a customer
        (getCustomerByUsername as jest.Mock).mockResolvedValue(mockedCustomer);

        //call the controller func(that we actually testing)
        await getCustomerDetailsByUsername(req,res);
        
        //Verify the service mthod was called with te corrent username (call controller func)
        expect(getCustomerByUsername).toHaveBeenCalledWith('Dusty6476');

        //Verify The response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Customer Profile Data By username",
            user: mockedCustomer
        })

    })

    it(`should return null if user doesn't exist`, async () =>{
        //the getCusotmerByUsers returns null when the users doenst' exits
        (getCustomerByUsername as jest.Mock).mockResolvedValue(null);
        await getCustomerDetailsByUsername(req,res);
        expect(getCustomerByUsername).toHaveBeenCalledWith('Dusty6476');
    })

})


describe('get Customer user by email ', () => { 
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
            params:{ email: 'victor.cronin@hotmail.com' }
        })
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should return user data feched by email', async () =>{
        (getCustomerByEmail as jest.Mock).mockResolvedValue(mockedCustomer);
        await getCustomerDetailsByEmail(req,res);
        expect(getCustomerByEmail).toHaveBeenCalledWith('victor.cronin@hotmail.com');

        //Verify The response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Customer Profile Data By email",
            user: mockedCustomer
        })

    })

    it(`should return null if user doesn't exist`, async () =>{
        //the getCusotmerByUsers returns null when the users doenst' exits
        (getCustomerByEmail as jest.Mock).mockResolvedValue(null);
        await getCustomerDetailsByEmail(req,res);
        expect(getCustomerByEmail).toHaveBeenCalledWith('victor.cronin@hotmail.com');
    })
})

describe('addProduct to wishlist', () => { 
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
            // body:{
            //     customerID: '67ab171a53bc80962a3686fd', //mockedCustomer.id
            //     productID: '17ab171b53bc50912a3686ah'
            // }
            body:{
                customerID: '4', //mockedCustomer.id
                productID: '5'
            }
        })
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should increase wishlist with new product', async () =>{
        //the updateCustomerWishList doesn't return anything -> its only update (void)
        //SO it will return 'TRUE'
        (updateCustomerWishlist as jest.Mock).mockResolvedValue(true);
        await addProductToWishlist(req,res);
        // expect(updateCustomerWishlist).toHaveBeenCalledWith('67ab171a53bc80962a3686fd', '17ab171b53bc50912a3686ah', 'add');
        expect(updateCustomerWishlist).toHaveBeenCalledWith('4', '5', 'add');

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Customer wishlist increased",
        })
    })
})

describe('removeProduct to wishlist', () => { 
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
            // params:{
            //     customerID: '67ab171a53bc80962a3686fd', //mockedCustomer.id
            //     productID: '17ab171b53bc50912a3686ah'
            // }
            params:{
                customerID: '4', //mockedCustomer.id
                productID: '5'
            }
        })
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should decrease wishlist', async () =>{
        (updateCustomerWishlist as jest.Mock).mockResolvedValue(true);
        await removeProductToWishlist(req,res);
        // expect(updateCustomerWishlist).toHaveBeenCalledWith('67ab171a53bc80962a3686fd', '17ab171b53bc50912a3686ah', 'remove');
        expect(updateCustomerWishlist).toHaveBeenCalledWith('4', '5', 'remove');

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Customer wishlist decreased",
        })
    })
})

describe('addFarmer to savedlist', () => { 
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        //data from the client request (body)
        req = mockRequest({
            // body: {
            //     customerID: '67ab171a53bc80962a3686fd', //mockedCustomer.id
            //     farmerID: '67ab173453bc80962a36871e', 
            // }
            body: {
                customerID: '4', //mockedCustomer.id
                farmerID: '5', 
            }
        })
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should increase wishlist with new product', async () =>{
        (updateCustomerSavedFarmers as jest.Mock).mockResolvedValue(true);
        await addFarmerToSavedList(req,res);
        // expect(updateCustomerSavedFarmers).toHaveBeenCalledWith('67ab171a53bc80962a3686fd', '67ab173453bc80962a36871e', 'add');
        expect(updateCustomerSavedFarmers).toHaveBeenCalledWith('4', '5', 'add');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Customer saved list increased",
        })
    })
})

describe('addOrder to historyList', () => { 
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
            body:{
                customerID: '4', //mockedCustomer.id
                orderID: '31221', 
            }
            // body:{
            //     customerID: '67ab171a53bc80962a3686fd', //mockedCustomer.id
            //     orderID: '66ab172453bc80962a12871g', 
            // }
        })
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should increase wishlist with new product', async () =>{
        (updateCustomerOrderHistory as jest.Mock).mockResolvedValue(true);
        await addOrderToHistory(req,res);
        // expect(updateCustomerOrderHistory).toHaveBeenCalledWith('67ab171a53bc80962a3686fd', '66ab172453bc80962a12871g');
        expect(updateCustomerOrderHistory).toHaveBeenCalledWith('4', '31221');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Customer History increased",
        })
    })
})