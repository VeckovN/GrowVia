import { Schema } from 'mongoose';
import { FarmLocation } from '@veckovn/growvia-shared'; //update the interface props in library

//subSchema for address props
const AddressSchema = new Schema<FarmLocation>(
    {
        country: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
        city: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
        address: { type: String, required: true, trim: true, minlength: 5, maxlength: 100 },
        latitude: { type: String },
        longitude: { type: String }
    }
)

const FarmerSchema: Schema = new Schema(
    {
        username: { 
            type: String, 
            require:true,
            index:true,  //create index based on username
            minlength: 3, 
            maxlength: 20, 
            trim: true,
            match: /^[a-zA-Z0-9_-]+$/
        }, 
        email: { 
            type: String, 
            required: true, 
            index: true,  //create index based on email
            unique: true, 
            trim: true, 
            lowercase: true, 
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email format validation
        }, 
        fullName: { 
            type: String, 
            required: true, 
            //index: true, 
            trim: true,
            minlength: 3,
            maxlength: 50,
            match: /^[a-zA-Z\s]+$/
        },
        address: { 
            type:AddressSchema, 
            require:true
        },
        profilePicture: { 
            type: String,
            default: "",
            trim: true,
            match: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, // Only allow valid image URLs
        }, //cr
        description: {
            type: String,
            trim: true,
            maxlength: 500, // Limit description length
        },
        socialLinks: [
            {
                type: String,
                required: false,
                trim: true,
                //match: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}\/?.*$/, // URL format validation
            },
        ],
    },
    //{ versionKey: false}, // intially mongoDB returns __v on property, with this versionKey shouldn't be returned
    { timestamps: true } //Automatically adds createdAt & updatedAt
)

// // Pre-Save Hook - Ensure unique email before saving
// FarmerSchema.pre("save", async function (next) {
//     if (this.isModified("email")) {
//         const existingUser = await mongoose.models.Farmer.findOne({ email: this.email });
//         if (existingUser) {
//             throw new Error("Email already in use!");
//         }
//     }
//     next();
// });

// // Pre-Save Hook - Convert username to lowercase before saving
// FarmerSchema.pre("save", function (next) {
//     this.username = this.username.toLowerCase();
//     next();
// });

export { FarmerSchema }