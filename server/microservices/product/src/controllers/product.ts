import { ProductDocumentInterface, ProductCreateInterface, BadRequestError, ProductSearchOptionsInterface } from '@veckovn/growvia-shared';
import { Request, Response } from 'express';
import { createProduct, deleteProduct, updateProduct, getProductById, getFarmerProducts, getProductsByCategory } from '@product/services/product';
import { getMoreSimilarProducts, getNewestProducts ,productsSearch } from '@product/services/search';
import { z } from 'zod';
// import { ProductCreateZodSchema, ProductUpdateZodSchema } from '@product/schema/product';
import { ProductCreateZodSchema, ProductUpdateZodSchema } from '@product/schema/product';
// import { sortBy } from 'lodash';

const productCreate = async (req: Request, res: Response): Promise<void> => {
    try{
        console.log("req.body: ", req.body);

        ProductCreateZodSchema.parse(req.body);

        const images = req.body.images;
        if (!images || !Array.isArray(images) || images.length === 0) {
            throw BadRequestError("At least one image is required", "Product Controller");
        }

        // Validate each image is a proper base64 string
        images.forEach(img => {
            if (!img.match(/^data:image\/(jpeg|png|gif);base64,/)) {
                throw BadRequestError("Invalid image format", "Product Controller");
            }
        });

        //only logged user can create product
        const product: ProductCreateInterface = {
            farmerID: req.body.farmerID,
            farmName: req.body.farmName,
            farmerLocation: req.body.farmerLocation,
            farmerAvatar: req.body.farmerAvatar, //{url, publicID}
            name: req.body.name,
            images: req.body.images,
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


// const searchProducts = async (req: Request, res: Response): Promise<void> => {
//     const { from, size, type } = req.params; //fron the URL -> /products/:from/:size/:type
//     const { query, minPrice, maxPrice } = req.query; 
//     console.log("req params: ", req.params);
//     console.log("\n req Query: ", req.query); 
    
//     let productsResult: ProductDocumentInterface[] = [];
//     const paginate:PaginatePropsInterface = { from, size: parseInt(`${size}`), type }
//     const productsHits = await productsSearch(`${query}`, paginate, parseInt(`${minPrice}`), parseInt(`${maxPrice}`));
//     for(const product of productsHits.hits){
//         productsResult.push(product._source as ProductDocumentInterface);
//     }
//     res.status(200).json({ message: "Search products", products: productsResult });
// }


//refactored:
const searchProducts = async (req: Request, res: Response): Promise<void> => {
    console.log("req query !! :: ", req.query);

    //pagination params
    // const page = parseInt(req.query.page as string) || 1;
    const from = parseInt(req.query.from as string) || 0;
    const pageSize = parseInt(req.query.size as string) || 12;

    console.log("FROM: ", from);
    console.log("PAGE SIZE: ", pageSize);

    // Extract filter params
    const { 
        query,
        category,
        subCategories,
        minPrice,
        maxPrice,
        location,
        quantity,
        unit,
        sort
    } = req.query;

    //Test this
    // Convert comma-separated subCategories to array
    const subCategoriesArray = subCategories 
        ? (subCategories as string).split(',') 
        : undefined;

    // Prepare search options
    const searchOptions: ProductSearchOptionsInterface = {
        query: query as string,
        category: category as string,
        subCategories: subCategoriesArray,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        location: location as string,
        quantity: quantity ? parseInt(quantity as string) : undefined,
        unit: unit as string,
        sort: sort as 'relevant' | 'price_asc' | 'price_desc' | 'newest' | undefined,
        from: from,
        size: pageSize
    };


    let productsResult: ProductDocumentInterface[] = [];
    const productsHits = await productsSearch(searchOptions);
    for(const product of productsHits.hits){
        productsResult.push(product._source as ProductDocumentInterface);
    }

    res.status(200).json({ message: 'Search products', products:productsResult, total:productsHits.total });
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

const getNewestProductsInOrder = async(req: Request, res: Response): Promise<void> => {
    const limit = parseInt(req.params.limit);

    if(!limit && isNaN(limit)){
        throw BadRequestError("Limit must be a valid number", "Product Controller");
    }

    let productsResult: ProductDocumentInterface[] = [];
    const productsHits = await getNewestProducts(limit);
    for(const product of productsHits.hits){
        productsResult.push(product._source as ProductDocumentInterface);
    }

    console.log("productsResult");

    res.status(200).json({ message: "Get newest products", products:productsResult });
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
    getMoreProductsLikeThis,
    getNewestProductsInOrder
}