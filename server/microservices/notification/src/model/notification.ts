import mongoose, { Schema, Model } from 'mongoose';
import { NotificationInterface } from '@veckovn/growvia-shared'; 

//check does fetch notification data has id or _id props (is the same as NotificationInterface)
const NotificationSchema: Schema = new Schema(
    {
        // id automaticaly created
        type: {
            type: String,
            enum: ['order', 'iot', 'authentication', 'rating', 'general', 'system'], // Add more types if needed
            required: true,
        },
        sender: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            avatarUrl: { type: String }
        },
        receiver: {
            id: { type: String, required: true },
            name: { type: String, required: true }
        },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        //Type specific fields - optional
        order: {
            orderId: { type: String }, // string or ObjectId
            status: { type: String }
        },
        iot: {  
            iotStatus: { type: String}
        },
        bothUsers: { type: Boolean, default: false}, //This flag should be used to tell that notification is related to both users (receiver/sender) -> for PaymentFailed for example
    },
    {
        timestamps: true,
    },
)

const NotificationModel: Model<NotificationInterface> = mongoose.model<NotificationInterface>("Notification", NotificationSchema, "Notification");
export { NotificationModel }