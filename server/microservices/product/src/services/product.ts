import { ProductDocumentInterface  } from "@veckovn/growvia-shared";
import { getDataIndex, addDataToIndex, updateDataIndex, deleteDataIndex } from "@product/elasticsearch";
import { ProductModel } from "@product/model/product";
import { productsSerachByFarmerID, productsSerachByCategory } from "@product/services/search";

const createProduct = async(product:ProductDocumentInterface):Promise<ProductDocumentInterface> =>{
    const createdDocument = await ProductModel.create(product);
    //the new created document will be returned

    console.log("createdDocument: ", createdDocument);
    //Store it in ELasticSearch (JSON object should be stored) -> Transform _id to id 
    if(createdDocument){ 
        //if the products is created, the toJSON (that transform _id to id) will be added to every object 
        const data =  createdDocument.toJSON?.() as ProductDocumentInterface; //Convert Mongoose Obj(_doc) to the JSON Object 
        console.log("createdDocument JSON: ", data);
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
// const deleteProduct = async(productID: string, farmerID: string):Promise<void> =>{
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
// const getFarmersProducts = async(farmerID): Promise<ProductDocumentInterface> => { 
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

export {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getFarmerProducts,
    getProductsByCategory
}