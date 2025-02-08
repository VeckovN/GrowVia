import mongoose, { Model } from 'mongoose';
import { CustomerDocumentInterface } from '@veckovn/growvia-shared';
import { CustomerSchema } from "@users/schema/customer";

const CustomerModel: Model<CustomerDocumentInterface> =  mongoose.model<CustomerDocumentInterface>("Customer", CustomerSchema, "Customer");
export { CustomerModel }