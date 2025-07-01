import { Request, Response} from 'express';
import { FarmerDocumentInterface } from '@veckovn/growvia-shared';
import { 
    getFarmerByUsername,
    getFarmerByEmail

} from '@users/services/farmer';
import { 
    getFarmerDetailsByUsername,
    getFarmerDetailsByEmail
} from "@users/controllers/farmer";

jest.mock('@users/services/farmer', () =>({
    getFarmerByUsername: jest.fn(),
    getFarmerByEmail: jest.fn(),
}))

//expected returned customer data
const mockedFarmer: FarmerDocumentInterface = {
    // id: "67ab173453bc80962a36871e",    
    userID: "5",    
    username: "Marieann4367",
    email: "madie.mertz-gislason38@hotmail.com",
    fullName: "Arnaldo Stracke",
    farmName: "Kub, Bechtelar and Tillman",
    location: {
        country: "Serbia",
        city: "Belgrade",
        address: "Mok",
        latitude: '',
        longitude: '',
    },
    profileAvatar: { 
        url: "https://picsum.photos/seed/dXBWE/1985/3546?blur=4",
        publicID: '12312'
    },
    backgroundImage: { 
        url: "https://picsum.photos/seed/dXBWE/1985/3546?blur=4",
        publicID: '123123'
    },
    socialLinks: []
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

describe('get Farmer user by username ', () => { 
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
            params:{ username: 'Marieann4367' }
        })
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should return user date feched by username', async () =>{
        (getFarmerByUsername as jest.Mock).mockResolvedValue(mockedFarmer);
        await getFarmerDetailsByUsername(req,res);
        expect(getFarmerByUsername).toHaveBeenCalledWith('Marieann4367');
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Farmer Profile Data By username",
            user: mockedFarmer
        })
    })

    it(`should return null if user doesn't exist`, async () =>{
        (getFarmerByUsername as jest.Mock).mockResolvedValue(null);
        await getFarmerDetailsByUsername(req,res);
        expect(getFarmerByUsername).toHaveBeenCalledWith('Marieann4367');
    })

})


describe('get Farmer user by email ', () => { 
    let req:Request;
    let res:Response;

    beforeEach(() =>{
        req = mockRequest({
            params:{ email: 'madie.mertz-gislason38@hotmail.com' }
        })
        res = mockResponse();
    })

    afterEach(() =>{
        jest.restoreAllMocks();
    })

    it('should return user data feched by email', async () =>{
        (getFarmerByEmail as jest.Mock).mockResolvedValue(mockedFarmer);
        await getFarmerDetailsByEmail(req,res);
        expect(getFarmerByEmail).toHaveBeenCalledWith('madie.mertz-gislason38@hotmail.com');

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Farmer Profile Data By email",
            user: mockedFarmer
        })

    })

    it(`should return null if user doesn't exist`, async () =>{
        (getFarmerByEmail as jest.Mock).mockResolvedValue(null);
        await getFarmerDetailsByEmail(req,res);
        expect(getFarmerByEmail).toHaveBeenCalledWith('madie.mertz-gislason38@hotmail.com');
    })
})