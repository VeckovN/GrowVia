import mongoose, { Schema, Model } from 'mongoose';
import { NotificationInterface } from '@veckovn/growvia-shared'; 

//check does fetch notification data has id or _id props (is the same as NotificationInterface)
const NotificationSchema: Schema = new Schema(
    {
        // id automaticaly created
        type: {
            type: String,
            enum: ['Order', 'Authentication', 'General'], // Add more types if needed
            required: true,
        },
        senderID: { type: mongoose.Schema.Types.ObjectId, index:true, require:true}, //User id  from Users Service DB (mongoDB as well)
        senderUsername: { type: String, required: true },
        senderEmail: { type: String},
        receiverID: { type: mongoose.Schema.Types.ObjectId, index:true, require:true}, //User id  from Users Service DB (mongoDB as well)
        receiverUsername: { type: String, required: true },
        receiverEmail: { type: String},
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false},
        orderID: { type: String },
        bothUsers: { type: Boolean, default: false}
    },
    {
        timestamps: true,
    },
)

const NotificationModel: Model<NotificationInterface> = mongoose.model<NotificationInterface>("Notification", NotificationSchema, "Notification");
export { NotificationModel }