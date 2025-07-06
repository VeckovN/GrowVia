import { BadRequestError, UserLocation, ProductDocumentInterface, OrderItemDocumentInterface, ProductCreateInterface } from "@veckovn/growvia-shared";
import { getDataIndex, addDataToIndex, updateDataIndex, deleteDataIndex } from "@product/elasticsearch";
import { ProductModel } from "@product/model/product";
import { uploadProductImageToCloudinary } from "@product/helper";
import { productsSerachByFarmerID, productsSerachByCategory } from "@product/services/search";

interface UserProductUpdatePropInterface {
    farmerID?: string;
    farmName?: string;
    location?: UserLocation;
}

const createProduct = async(product:ProductCreateInterface):Promise<ProductDocumentInterface> =>{
    console.log("PRODUCT: ", product);
    const images = product.images as string[];
    if (!images || images.length === 0) {
        throw BadRequestError("At least one image is required", "Product Service");
    }

    const uploadedImages = await uploadProductImageToCloudinary(images); 
    if (uploadedImages.length === 0) {
        throw BadRequestError("Failed to upload images", "Product Service");
    }
    
    const createProductData: ProductCreateInterface = {
        ...product,
        images: uploadedImages
    }
    
    let createdDocument;
    try {
        createdDocument = await ProductModel.create(createProductData);
    } 
    catch (mongoError) {
        console.error("MongoDB creation failed:", mongoError);
        throw new Error("Product database persistence failed");
    }

    //Store it in ELasticSearch (JSON object should be stored) -> Transform _id to id 
    if(createdDocument){ 
        //if the products is created, the toJSON (that transform _id to id) will be added to every object 
        const data =  createdDocument.toJSON?.() as ProductDocumentInterface; //Convert Mongoose Obj(_doc) to the JSON Object 
        const productID = createdDocument._id; 
        await addDataToIndex('products', `${productID}`, data);  
        //Produce message to the User Service (for adding new product) if is implemented in USER SERVICE
    }

    return createdDocument;
}

const updateProduct = async(productID: string, product:ProductDocumentInterface):Promise<ProductDocumentInterface> =>{
    //id as productID
    const updatedDocument = await ProductModel.findOneAndUpdate(
        { _id: productID },
        {
            $set:{
                name: product.name,
                images: product.images,
                description: product.description,
                shortDescriptiion: product.shortDescription,
                category: product.category,
                subCategories: product.subCategories,
                price: product.price,
                stock: product.stock,
                unit: product.unit,
                tags: product.tags
            }
        },
        { new:true }
    ).exec() as ProductDocumentInterface;

    if(updatedDocument){
        const data = updatedDocument.toJSON?.() as ProductDocumentInterface; //get JSON forma
        await updateDataIndex('products', `${updatedDocument._id}`, data);
    }

    return updatedDocument;
}


const deleteProduct = async(productID: string):Promise<void> =>{
    await ProductModel.deleteOne({ _id:productID }).exec();
    //produce message to farmer (based on farmeriD)
    await deleteDataIndex('products', productID);
}


//retreiving data elasticsearch
const getProductById = async(productID: string): Promise<ProductDocumentInterface> => {
    const product = await getDataIndex('products', productID); //productID is the the same id from the MonogoDB (check above)
    return product;
}

// //using search feature to get Farmers products
const getFarmerProducts = async(farmerID: string): Promise<ProductDocumentInterface[]> => {
    const productsHits = await productsSerachByFarmerID(farmerID);
    const productsResult: ProductDocumentInterface[] = [];
    for(const product of productsHits.hits){
        productsResult.push(product._source as ProductDocumentInterface);
    }

    return productsResult;
}

const getProductsByCategory = async(category: string): Promise<ProductDocumentInterface[]> => {
    const productsHits = await productsSerachByCategory(category);
    const productsResult: ProductDocumentInterface[] = [];
    for(const product of productsHits.hits){
        productsResult.push(product._source as ProductDocumentInterface);
    }
    return productsResult;
}

const decreaseProductStock = async(orderProductList: OrderItemDocumentInterface[]) => {
    //bulkWrite()
    //Performance: Executes multiple updates in one operation instead of making separate calls for each product.
    //Atomicity: Reduces the risk of inconsistencies when multiple orders modify the stock.
    const bulkOperations = orderProductList.map((orderItem) => ({
        updateOne:{
            filter: { _id: orderItem.product_id},
            update: { $inc: { stock: -orderItem.quantity } }
        }
    }));

    if (bulkOperations.length > 0) {
        await ProductModel.bulkWrite(bulkOperations);
    }

    const updatedProducts = await ProductModel.find({
        _id: { $in: orderProductList.map((item) => item.product_id) }
    });

    return updatedProducts;
}

const updateUserProductData = async(data:UserProductUpdatePropInterface) =>{
    const {farmerID, ...updateData} = data;

    //Take all products from mongodB
    const products = await ProductModel.find({farmerID}) 

    for(const product of products){
        if(updateData.farmName) product.farmName = updateData.farmName
        if(updateData.location) product.farmerLocation = updateData.location

        //update mongoDB
        await product.save();

        //update same product in EleasticSearch
        const productElasticData = product.toJSON();
        await updateDataIndex('products', `${product._id}`, productElasticData);
    }
}

export {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getFarmerProducts,
    getProductsByCategory,
    decreaseProductStock,
    updateUserProductData,
}