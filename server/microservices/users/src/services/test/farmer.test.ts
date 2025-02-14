import { FarmerModel } from '@users/models/farmer';
import { FarmerDocumentInterface } from '@veckovn/growvia-shared';
import { 
    getFarmerByUsername, 
    getFarmerByEmail,
    updateFarmerDataByID
} from '@users/services/farmer';

jest.mock('@users/models/farmer', () => ({
    FarmerModel: {
        findOne: jest.fn().mockReturnValue({
            exec: jest.fn(), 
        }),
        findOneAndUpdate: jest.fn(),
        updateOne: jest.fn()
    }
}))


describe('getFarmerByUsername and getFarmerByEmail', () => {
    const mockFarmer = {
        username: 'Kris5131',
        email: 'rahul.kohler33@gmail.com',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should get a farmer by username', async () => {
        //use ().exec with mockResolvedValue
        (FarmerModel.findOne().exec as jest.Mock).mockResolvedValue(mockFarmer);
        const result = await getFarmerByUsername('Kris5131');
        expect(FarmerModel.findOne).toHaveBeenCalledWith({ username: 'Kris5131' });
        expect(result).toEqual(mockFarmer);
    });

    it('should get a farmer by email', async () => {
        (FarmerModel.findOne().exec as jest.Mock).mockResolvedValue(mockFarmer);
        const result = await getFarmerByEmail('rahul.kohler33@gmail.com');
        expect(FarmerModel.findOne).toHaveBeenCalledWith({ email: 'rahul.kohler33@gmail.com' });
        expect(result).toEqual(mockFarmer);
    });

    it('should return null if farmer is not found', async () => {
        (FarmerModel.findOne().exec as jest.Mock).mockResolvedValue(null);
        const result = await getFarmerByUsername('nonexistent');
        expect(result).toBeNull();
    });
});

describe('updateCustomerDataByID', () => {
    const mockFarmerID = '67ab171a53bc80962a3686fd';
    const mockUpdateData:FarmerDocumentInterface = {
        username:"newUsername",
        farmName:"newFarmName"
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update customer data by ID', async () => {
        (FarmerModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdateData);
        const result = await updateFarmerDataByID(mockFarmerID, mockUpdateData);
        expect(FarmerModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: mockFarmerID },
            { $set: mockUpdateData },
            { new:true }
        );
        expect(result).toEqual(mockUpdateData);
    })

    it("should return null if customer isn't found ", async() => {
        (FarmerModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
        const result = await updateFarmerDataByID('noexistID', mockUpdateData); 
        expect(result).toBeNull();
    })
})


