import { ProductDocumentInterface } from '@veckovn/growvia-shared';
import { Request, Response } from 'express';
import { createProduct, deleteProduct, updateProduct, getProductById } from '@product/services/product';

const productCreate = async (req: Request, res: Response): Promise<void> => {
    //validate zod schema
    
    //upload images to cloudinary

    //only logged user can create product
    const product: ProductDocumentInterface = {
        //consider to put username, email of farmer
        farmerID: req.body.farmerID,
        name: req.body.name,
        // images: `${uploadImg.secure_url}, //already uploaded images
        images: req.body.images, //for test
        description: req.body.description,
        shortDescription: req.body.shortDescription,
        categories: req.body.shortDescriptiion,
        subCategories: req.body.shortDescriptiion,
        price: req.body.shortDescriptiion,
        stock: req.body.stock,
        unit: req.body.unit,
        tags: req.body.tags
    }

    const createdProduct: ProductDocumentInterface = await createProduct(product);
    res.status(200).json({ message: 'Product created successfully', product: createdProduct });
}


const productByID = async (req: Request, res: Response): Promise<void> => {
    const product: ProductDocumentInterface = await getProductById(req.params.productID);
    res.status(200).json({ message: "Get product by id", product });
}

// //get all products by FarmerID
// const getProductsByFarmerID = async (req: Request, res: Response): Promise<void> => {
// }

// const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
// }

// const validatUrl = (value: string): boolean  =>{
//     const dataUrlRegex =
//     /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*)\s*$/i;
//     return dataUrlRegex.test(value);
// }

const productUpdate = async (req: Request, res: Response): Promise<void> => {
    //validate zod schema
    
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
        categories: req.body.categories,
        subCategories: req.body.subCategories,
        price: req.body.price,
        stock: req.body.stock,
        unit: req.body.unit,
        tags: req.body.tags
    }

    const updatedProduct: ProductDocumentInterface = await updateProduct(req.params.productID, product);
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
}

const productDelete = async (req: Request, res: Response): Promise<void> => {    
    // const { productID, farmerID } = req.params;
    const productID = req.params.productID;
    await deleteProduct(productID);
    res.status(200).json({ message: 'Product deleted successfully.' });
}

export {
    productCreate,
    productByID,
    productUpdate,
    productDelete
}