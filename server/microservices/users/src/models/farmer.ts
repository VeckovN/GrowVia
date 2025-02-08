import mongoose, { Model } from 'mongoose';
import { FarmerDocumentInterface } from '@veckovn/growvia-shared';
import { FarmerSchema } from "@users/schema/farmer";

// //Modal name'Customer' -> for example for ref this name should be pass
const FarmerModel: Model<FarmerDocumentInterface> =  mongoose.model<FarmerDocumentInterface>("Farmer", FarmerSchema, "Farmer");
export { FarmerModel }