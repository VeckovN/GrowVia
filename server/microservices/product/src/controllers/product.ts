import { ProductDocumentInterface, ProductCreateInterface, PaginatePropsInterface, BadRequestError } from '@veckovn/growvia-shared';
import { Request, Response } from 'express';
import { createProduct, deleteProduct, updateProduct, getProductById, getFarmerProducts, getProductsByCategory } from '@product/services/product';
import { getMoreSimilarProducts, productsSearch } from '@product/services/search';
import { z } from 'zod';
// import { ProductCreateZodSchema, ProductUpdateZodSchema } from '@product/schema/product';
import { ProductCreateZodSchema, ProductUpdateZodSchema } from '@product/schema/product';
import { sortBy } from 'lodash';

const productCreate = async (req: Request, res: Response): Promise<void> => {
    try{
        //validate zod schema
        ProductCreateZodSchema.parse(req.body);
        
        //upload images to cloudinary

        //only logged user can create product
        const product: ProductCreateInterface = {
            //consider to put username, email of farmer
            farmerID: req.body.farmerID,
            name: req.body.name,
            // images: `${uploadImg.secure_url}, //already uploaded images
            images: req.body.images, //for test
            description: req.body.description,
            shortDescription: req.body.shortDescription,
            category: req.body.category,
            subCategories: req.body.subCategories,
            price: req.body.price,
            stock: req.body.stock,
            unit: req.body.unit,
            tags: req.body.tags
        }

        const createdProduct: ProductDocumentInterface = await createProduct(product);
        res.status(200).json({ message: 'Product created successfully', product: createdProduct });
    }
    catch (error) {
        if(error instanceof z.ZodError){  //catch invalid data
            //thrown error that will be handled in error middleware from server.ts that actually return propriet res.status with message
            const errorMessages = error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            
            throw BadRequestError(`Invalid form data, error: ${JSON.stringify(errorMessages)} `, 'productCustomerZodSchema validation');
        } 
    }
}


const productByID = async (req: Request, res: Response): Promise<void> => {
    const product: ProductDocumentInterface = await getProductById(req.params.productID);
    res.status(200).json({ message: "Get product by id", product });
}

// //get all products by FarmerID
const farmerProductsByID = async (req: Request, res: Response): Promise<void> => {
    const products: ProductDocumentInterface[] = await getFarmerProducts(req.params.farmerID);
    res.status(200).json({ message: "Get farmer products by id", products });
}

const productsByCategory = async (req: Request, res: Response): Promise<void> => {
    const products: ProductDocumentInterface[] = await getProductsByCategory(req.params.category);
    res.status(200).json({ message: "Get products by category", products });
}


const searchProducts = async (req: Request, res: Response): Promise<void> => {
    const { from, size, type } = req.params; //fron the URL -> /products/:from/:size/:type
    ///Flexible filtering: with this req.query is also in URl but after '?' sign  (? query=''? minPrice=''? maxPrice='')
    ///products/:from/:size/:type?query=''?minPrice=''?maxPrice=''
    const { query, minPrice, maxPrice } = req.query; 
    console.log("req params: ", req.params);
    console.log("\n req Query: ", req.query); 
    
    let productsResult: ProductDocumentInterface[] = [];
    const paginate:PaginatePropsInterface = { from, size: parseInt(`${size}`), type }
    const productsHits = await productsSearch(`${query}`, paginate, parseInt(`${minPrice}`), parseInt(`${maxPrice}`));
    for(const product of productsHits.hits){
        productsResult.push(product._source as ProductDocumentInterface);
    }

    
    //if the user is on the bottom of the page type will be 'backward'
    //Backward pagination (type: 'backward'): Older reviews are loaded when scrolling up, so you sort them ascendingly to maintain chronological order.
    if(type === 'backward'){
        productsResult = sortBy(productsResult, ['createdAt']) //in our case the 'createdAt'
    }
    // else {
    //     // Descending: newest first
    //     productsResult = sortBy(productsResult, ['createdAt']).reverse();
    // }

    res.status(200).json({ message: "Search products", products: productsResult });
}

// const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
//     //take 5
// }

const getMoreProductsLikeThis = async(req: Request, res: Response): Promise<void> => {

    let productsResult: ProductDocumentInterface[] = [];
    const productsHits = await getMoreSimilarProducts(req.params.productID);
    for(const product of productsHits.hits){
        productsResult.push(product._source as ProductDocumentInterface);
    }

    res.status(200).json({ message: "Get product by id", products:productsResult });
}

// const validatUrl = (value: string): boolean  =>{
//     const dataUrlRegex =
//     /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*)\s*$/i;
//     return dataUrlRegex.test(value);
// }

const productUpdate = async (req: Request, res: Response): Promise<void> => {
    try{
        //validate zod schema
        ProductUpdateZodSchema.parse(req.body);

        // //reUpload image if is in the body request
        // const images = req.body.images;
        // let newImages;
        // if(images){
        //     images.forEach(el => {
        //         const imageUrl = validatUrl(el);
        //         //handle it
        //     });
        // }

        //only logged user can create product
        const product: ProductDocumentInterface = {
            name: req.body.name,
            // images: `${uploadImg.secure_url}, //already uploaded images
            images: req.body.images, //for test
            description: req.body.description,
            shortDescription: req.body.shortDescription,
            category: req.body.category,
            subCategories: req.body.subCategories,
            price: req.body.price,
            stock: req.body.stock,
            unit: req.body.unit,
            tags: req.body.tags
        }

        const updatedProduct: ProductDocumentInterface = await updateProduct(req.params.productID, product);
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    }
    catch (error) {
        if(error instanceof z.ZodError){  //catch invalid data
            //thrown error that will be handled in error middleware from server.ts that actually return propriet res.status with message
            const errorMessages = error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            
            throw BadRequestError(`Invalid form data, error: ${JSON.stringify(errorMessages)} `, 'productCustomerZodSchema validation');
        } 
    }
}

const productDelete = async (req: Request, res: Response): Promise<void> => {    
    const productID = req.params.productID;
    await deleteProduct(productID);
    res.status(200).json({ message: 'Product deleted successfully.' });
}

export {
    productCreate,
    productByID,
    productUpdate,
    productDelete,
    farmerProductsByID,
    productsByCategory,
    searchProducts,
    getMoreProductsLikeThis
}