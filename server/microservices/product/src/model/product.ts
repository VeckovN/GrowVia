import mongoose, { Schema, Model } from 'mongoose';
import { ProductDocumentInterface, UNIT_TYPES } from '@veckovn/growvia-shared';

const ProductSchema: Schema = new Schema(
    {
        farmerID: { type: mongoose.Schema.Types.ObjectId, index:true, require:true}, //Farmer user id  from Users Service DB (mongoDB as well)
        name: { type: String, required: true },
        images: [{ type: String, required: true}],
        description: { type: String, required: true },
        shortDescription: { type: String, required: true }, //SINTAX FIXED
        category: { type: String, required: true },
        subCategories: [{ type: String }],
        price: { type: Number, required: true, min:0 },
        stock: { type: Number, required: true, min:0 },
        unit:  { type: String, enum:UNIT_TYPES, require:true},
        tags: [{type: String, default: [], required: true}],
    },
    {
        timestamps: true,
        toJSON: {
            //_doc Mongoose object, rec pure JSON object
            transform(_doc, rec){
                rec.id = rec._id;
                delete rec._id;
                return rec;  //returning pure JSON object (not _doc)
            }
        }
    },
)
//Convert _id to id -> (Enusre same name prop (id) in both DBs)
//In Elastic Search we want to have id prop instead of _id that is default in mongoDB
//so Transform _id to id and save it in mongoDB as well.

ProductSchema.virtual('id').get(function() {
    return this._id;
});

const ProductModel: Model<ProductDocumentInterface> =  mongoose.model<ProductDocumentInterface>("Product", ProductSchema, "Product");
export { ProductModel }


// Create Product 
// const newProduct = new ProductModel({
//     name: "Organic Wheat Flour",
//     price: 3.5, // Price per kg
//     stock: 100, // 100 kg available
//     unit: "kg",
//     farmer: farmerId, // Reference to the farmer selling it
//     ...
//   });

// or with stock obj with 'quantity' and 'unit' props
// const newProduct = new ProductModel({
//     name: "Organic Wheat Flour",
//     price: 3.5, // Price per kg
//     stock:{
//         quantity: 100,
//         unit: 'kg'
//     }
//     farmer: farmerId, // Reference to the farmer selling it
//     ...
//   });

// Update stock after a purchases
// When a customer buys 5 kg of wheat:

// await ProductModel.findByIdAndUpdate(productId, { $inc: { stockQuantity: -5 } }
//This will reduce the stock by 5 kg.