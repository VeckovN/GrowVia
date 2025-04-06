
import { Request, Response} from 'express';
import { ObjectId } from 'mongoose';
import { ProductCreateInterface, ProductDocumentInterface } from '@veckovn/growvia-shared';

import { 
    createProduct,
    getProductById,
    getFarmerProducts,
    getProductsByCategory,
    updateProduct,
    deleteProduct
} from '@product/services/product';

import { 
    productCreate,
    productByID,
    farmerProductsByID,
    productsByCategory,
    productUpdate,
    productDelete
} from '@product/controllers/product';


jest.mock('@product/services/product', () =>({
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    getProductById: jest.fn(),
    getFarmerProducts: jest.fn(),
    getProductsByCategory: jest.fn()
}))

jest.mock('@product/services/search', () =>({
    productsSerachByFarmerID: jest.fn()
}))


type reqTypes = string | number | Date | ObjectId | undefined;

const mockRequest = (options: { 
    body?: Record<string, reqTypes> | ProductCreateInterface | ProductDocumentInterface,
    params?: Record<string, reqTypes> 
}): Request => {
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

//mock new product data
export const mockNewProduct: ProductCreateInterface = {
    farmerID: '67ab173453bc80962a36871e', //from the user service (passed from frontend)
    name: 'Fresh Strawberries',
    images: [
        "https://example.com/images/fresh-strawberries.jpg"
    ],
    description: "Juicy and sweet fresh strawberries, perfect for desserts and smoothies.",
    shortDescription: "Fresh strawberries, 250g box.",
    category: "Fruits",
    subCategories: ["Berries", "Seasonal Fruits"],
    price: 5.99,
    stock: 85,
    unit: "g",
    tags: ["strawberries", "berries", "fresh", "fruits"]
}

//after the product created(additional _id, id, createdAt, toJSON)
export const mockProduct: ProductDocumentInterface = {
    _id: '67b6f6a07ff1e08e36f31e63',
    farmerID: '67ab173453bc80962a36871e', //from the user service (passed from frontend)
    name: 'Fresh Strawberries',
    images: [
        {
            url:"https://example.com/images/fresh-strawberries.jpg",
            publicID: "someID"
        }
    ],
    description: "Juicy and sweet fresh strawberries, perfect for desserts and smoothies.",
    shortDescription: "Fresh strawberries, 250g box.",
    category: "Fruits",
    subCategories: ["Berries", "Seasonal Fruits"],
    price: 5.99,
    stock: 85,
    unit: "g",
    tags: ["strawberries", "berries", "fresh", "fruits"],
    // createdAt: 
    toJSON: () => {},
}

describe('productCreate', () =>{
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
           body: mockNewProduct,
        });
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should create a new product', async () =>{
        (createProduct as jest.Mock).mockResolvedValue(mockProduct);
        await productCreate(req, res);
        //verify the service function was called with the correct data
        expect(createProduct).toHaveBeenCalledWith(mockNewProduct); 

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:"Product created successfully",
            product: mockProduct
        });
    })
})

describe('productByID', () =>{
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
           params: { productID: mockProduct._id }
        });
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should return product by productID', async () =>{
        (getProductById as jest.Mock).mockResolvedValue(mockProduct);
        await productByID(req, res);
        //verify the service function was called with the correct data
        expect(getProductById).toHaveBeenCalledWith(mockProduct._id); 

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:"Get product by id",
            product: mockProduct
        });
    })
})

describe('farmerProductsByID', () =>{
    const mockFarmerID = '67ab173453bc80962a36871e';

    //results are from  elasticsearch (this structure)
    const mockProductsResults = [
        { _id: '67b6f6a07ff1e08e36f31e61', name: 'Fresh Corn', farmerID: mockFarmerID},
        { _id: '67b6f6b57ff1e08e36f31e63', name: 'Organic Wheat Flour', farmerID: mockFarmerID }
    ]

    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
           params: { farmerID: mockFarmerID }
        });
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should return farmers products by farmerID', async () =>{
        (getFarmerProducts as jest.Mock).mockResolvedValue(mockProductsResults);
        await farmerProductsByID(req, res);
        expect(getFarmerProducts).toHaveBeenCalledWith(mockFarmerID);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:"Get farmer products by id",
            products: mockProductsResults
        });
    })

    it('should return an empty array if no product are found', async () =>{
        (getFarmerProducts as jest.Mock).mockResolvedValue([]);
        await farmerProductsByID(req, res);
        expect(getFarmerProducts).toHaveBeenCalledWith(mockFarmerID);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:"Get farmer products by id",
            products: []
        });
    })
})

describe('productsByCategory', () =>{
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
           params: { category: mockProduct.category }
        });
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should return product by productID', async () =>{
        (getProductsByCategory as jest.Mock).mockResolvedValue(mockProduct);
        await productsByCategory(req, res);
        //verify the service function was called with the correct data
        expect(getProductsByCategory).toHaveBeenCalledWith(mockProduct.category); 

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:"Get products by category",
            products: mockProduct
        });
    });

    it('should return an empty array if no product are found by category', async () =>{
        (getProductsByCategory as jest.Mock).mockResolvedValue([]);
        await productsByCategory(req, res);
        expect(getProductsByCategory).toHaveBeenCalledWith(mockProduct.category);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:"Get products by category",
            products: []
        });
    })
})



describe('productUpdate', () =>{
    const mockProductID = '67b6f6a07ff1e08e36f31e63'

    const mockProductUpdateData: ProductDocumentInterface = {
        name: 'Fresh Strawberries',
        category: "Fruits",
        description: "Juicy and sweet fresh strawberries, perfect for desserts and smoothies.",
        // price: 5.99,
        // stock: 85,
        price: 7.99,
        stock: 100,
        unit: "kg",
        // tags: ["strawberries", "berries", "fresh", "fruits"],
        tags: ["strawberries", "berries", "fresh"]
    }

    const mockNewUpdatedProduct = { 
        farmerID: '67ab173453bc80962a36871e', //from the user service (passed from frontend)
        name: 'Fresh Strawberries',
        images: [
            "https://example.com/images/fresh-strawberries.jpg"
        ],
        description: "Juicy and sweet fresh strawberries, perfect for desserts and smoothies.",
        shortDescription: "Fresh strawberries, 250g box.",
        category: "Fruits",
        subCategories: ["Berries", "Seasonal Fruits"],
        // price: 5.99,
        // stock: 85,
        price: 6.99,
        stock: 100,
        unit: "g",
        // tags: ["strawberries", "berries", "fresh", "fruits"],
        tags: ["strawberries", "berries", "fresh"],
        // createdAt: 
        toJSON: () => {},
    }

    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
            params: { productID: mockProductID },
            body: mockProductUpdateData,
        });
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should create a new product', async () =>{
        (updateProduct as jest.Mock).mockResolvedValue(mockNewUpdatedProduct);
        await productUpdate(req, res);
        expect(updateProduct).toHaveBeenCalledWith(mockProductID, mockProductUpdateData); 

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:"Product updated successfully",
            product: mockNewUpdatedProduct
        });
    })
})


describe('productDelete', () =>{
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
           params: { productID: mockProduct._id }
        });
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should delete product and return successfull message', async () =>{
        (deleteProduct as jest.Mock).mockResolvedValue(true);
        await productDelete(req, res);
        expect(deleteProduct).toHaveBeenCalledWith(mockProduct._id); 

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message:"Product deleted successfully.",
        });
    })

})