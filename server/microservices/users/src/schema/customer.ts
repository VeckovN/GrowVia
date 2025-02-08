import mongoose, { Schema } from 'mongoose';
import { UserLocation } from "@veckovn/growvia-shared" 

//subSchema for address props
const AddressSchema = new Schema<UserLocation>(
    {
        country: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
        city: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
        address: { type: String, required: true, trim: true, minlength: 5, maxlength: 100 },
    }
)

const CustomerSchema: Schema = new Schema(
    {
        username: { 
            type: String, 
            require:true,
            index:true,  //create index based on username
            minlength: 3, 
            maxlength: 20, 
            trim: true,
            match: /^[a-zA-Z0-9_-]+$/, // Allows letters, numbers, underscores, and hyphens
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
            // match: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, // Only allow valid image URLs
        }, //create index based on fullName

        // 'Product' Reference to Another Products MongoDB  
        //Product DB is the mongoDB as well , so the product Id is same type
        purchasedProducts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
        wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}], //array of products type (From Product Interface) string[Product]
        
        // 'Farmers' Reference to Farmers -> same MongoDB
        savedFarmers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Farmer" }],
        
        //Reference to Orders (PostgreSQL, using UUID)
        orderHistory: [{  // PostgreSQL order IDs stored as UUID strings
            type: String,
            validate: { //with validator 
                validator: (v: string) => /^[0-9a-fA-F-]{36}$/.test(v), // UUID format validation
                message: "Invalid UUID format for order ID."
            } 
        }], 
    },
    //{ versionKey: false}, // intially mongoDB returns __v as property, with this versionKey shouldn't be returned
    { timestamps: true } //Automatically adds createdAt & updatedAt
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
// //Modal name'Customer' -> for example for ref this name should be pass
// const CustomerModel: Model<CustomerDocumentInterface> =  mongoose.model<CustomerDocumentInterface>("Customer", CustomerSchema, "Customer");
// export { CustomerModel }