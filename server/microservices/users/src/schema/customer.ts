import { Schema } from 'mongoose';
import { UserLocation } from "@veckovn/growvia-shared" 

const LocationSchema = new Schema<UserLocation>(
    {
        country: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
        city: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
        address: { type: String, required: true, trim: true, minlength: 5, maxlength: 100 },
    }
)

const CustomerSchema: Schema = new Schema(
    {
        userID: {
            type: String, 
            require:true,
            index:true, 
            unique: true,
        },
        username: { 
            type: String, 
            require:true,
            index:true, 
            minlength: 3, 
            maxlength: 20, 
            trim: true,
            match: /^[a-zA-Z0-9_-]+$/ // Allows letters, numbers, underscores, and hyphens
        }, 
        email: { 
            type: String, 
            required: true, 
            index: true,  
            unique: true, 
            trim: true, 
            lowercase: true, 
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }, 
        fullName: { 
            type: String, 
            required: true, 
            trim: true,
            minlength: 3,
            maxlength: 50,
            match: /^[a-zA-Z\s]+$/
        },
        location: { 
            type:LocationSchema, 
            require:true
        },
        profilePicture: { 
            type: String,
            default: "",
            trim: true,
            // match: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, // Only allow valid image URLs
        }, 
        profilePublicID: {  //cloudinary image id
            type: String,
            default: "", 
            trim: true,
        }, 
        purchasedProducts: [{
            type: String
        }],
        wishlist: [{ 
            type: String
        }],
        savedFarmers: [{
            type: String,
            validate: {
                validator: (v: string) => /^[a-zA-Z0-9_-]+$/.test(v),
                message: "Invalid farmerID format."
            }
        }],
        orderHistory: [{  // PostgreSQL order IDs stored as UUID strings
            type: String,
            validate: {
                validator: (v: string) => /^[0-9a-fA-F-]{36}$/.test(v), // UUID format validation
                message: "Invalid UUID format for order ID."
            } 
        }], 
    },
    //{ versionKey: false}, // intially mongoDB returns __v as property, with this versionKey shouldn't be returned
    { timestamps: true } 
)


//Pre-save Hook: Ensure Unique Email (This will be executed before any other method)
// CustomerSchema.pre('save', async function (next) {
//     const existingUser = await mongoose.models.Customer.findOne({ email: this.email });
//     if (existingUser) {
//         throw new Error("Email already in use!");
//     }
//     next();
// });

export { CustomerSchema }
