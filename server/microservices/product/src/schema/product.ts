import mongoose, { Schema } from 'mongoose';

//form shared library
const UNIT_TYPES = ["piece", "kg", "g", "liter", "ml"] as const;
// type UnitType = (typeof UNIT_TYPES)[number];  

//Mongoose Schema 
const ProductSchema: Schema = new Schema(
    {
        farmerID: { type: mongoose.Schema.Types.ObjectId, index:true, require:true}, //Farmer user id  from Users Service DB (mongoDB as well)
        name: { type: String, required: true },
        images: [{ type: String, required: true}],
        description: { type: String, required: true },
        shortDescriptiion: { type: String, required: true },
        categories: { type: String, required: true },
        subCategories: [{ type: String }],
        price: { type: Number, required: true, min:0 },
        stock: { type: Number, required: true, min:0 },
        unit:  { type: String, enum:UNIT_TYPES, require:true},
        tags: [{type: String, default: [], required: true}],
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, rec){
                rec.id = rec._id;
                delete rec._id;
                return rec;
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




export { ProductSchema }