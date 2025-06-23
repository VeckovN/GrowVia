import { ChangeEvent, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import TextField from '../../shared/inputs/TextField';
import SelectField from '../../shared/inputs/SelectField';

import { productCategories, subCategories, UNIT_TYPES, UnitType} from '../../shared/utils/data';
import { CreateProductInterface } from '../../product/product.interface';
import { useSchemaValidation } from '../../shared/hooks/useSchemaValidation';
import { productSchema } from '../../product/product.schema';
import { ProductFormInterface } from '../../product/product.interface';

import uploadImage from '../../../assets/upload.svg';

import { useCreateProductMutation, useGetProductByFarmerIDQuery } from '../../product/product.service';
 

const ProductForm = ({mode, initialData, farmerID, onCloseModal}:ProductFormInterface) => {
    const categories = productCategories.map(prod => ({value:prod.name, label: prod.name}));
    const units = UNIT_TYPES.map(unit => ({value:unit, label: unit})); 
    console.log("FARMERID: ", farmerID); 
    console.log("FarmerID type: ", typeof(farmerID));

    console.log("INITAL DATA:" ,initialData);
    
    const defaultValues = {
        name: '',
        description: '',
        shortDescription: '',
        category: '',
        subCategories: [],
        price: null,
        stock: null,
        // unit: UNIT_TYPES,
        unit: null,
        tags: [],
        // images:[],
    }

     const [userData, setUserData] = useState<Omit<CreateProductInterface, 'farmerID'>>({
        ...defaultValues,
        ...initialData, // Will override defaults if provided (for Edit Form)
    });

    const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPerviewUrls] = useState<string[]>([]);
    
    const [createProduct] = useCreateProductMutation();
    const {data, isError} = useGetProductByFarmerIDQuery(farmerID);

    console.log("\n data: ", data);
    console.log("\n isError: ", isError);

    
    const [schemaValidation, validationErrors] = useSchemaValidation({
        schema: productSchema, 
        userData:{
            ...userData,
            farmerID: farmerID.toString(), //Product service expect string as farmerID
            subCategories: selectedSubCategories, //seperated state 
            images: previewUrls,
            tags: selectedSubCategories
        } 
    });
    const [actionError, setActionError] = useState<string>('');

    console.log("ValidatinErrors: ", validationErrors);
    //UseEffect(On mount the fetch subcategories should be passed to 'selectedSubCategories)
    console.log("\n userDatA: ", userData);

    const getBorderErrorStyle = (field: string): string =>{
        if(actionError || validationErrors[field])
            return 'border-0 border-b-4 border-red-400';
        else
            return '';
    }

    //fro all others filds insatea of subCategories and Images
    const handleChanges = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: 
                (name === 'price' || name === 'stock') 
                    ? value === '' 
                        ? null : Number(value) 
                
                : name === 'unit'
                    ? UNIT_TYPES.includes(value as UnitType)
                        ? value as UnitType
                        : null

                //Handle all other fields
                : value
        }))
    }

    const handleSubcategoryToggle = (subCat: string) => {
        setSelectedSubCategories(prev =>
            prev.includes(subCat)
                ? prev.filter(item => item !== subCat)
                : [...prev, subCat]
        )
    }

    const readAsBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    const reader: FileReader = new FileReader();
    const fileValue: Promise<string | ArrayBuffer | null> = new Promise((resolve, reject) => {
        reader.addEventListener('load', () => {
            resolve(reader.result);
        });

        reader.addEventListener('error', (event: ProgressEvent<FileReader>) => {
            reject(event);
        });

        reader.readAsDataURL(file);
    });
    return fileValue;
    };

    const handleFileChange = async(event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const target = event.target as HTMLInputElement;
        
        if(!target.files || target.files.length === 0 ){
            return
        }

        //Validate all files
        //NOT NOW

        //Process valid files
        // const newBase64Images: string[] = [];
        const newFiles: File[] = [];
        const newPreviewUrls: string[] = [];

        console.log("TargetFiles: ", target.files);
        
        try{
            const filesArray = Array.from(target.files);
    
            for( const file of filesArray) {
                // const base64 = await readAsBase64(file); 
                // newBase64Images.push(base64 as string);
                newFiles.push(file);
                newPreviewUrls.push(URL.createObjectURL(file))
            }
    
            //update file state 
            setImageFiles(prev => [...prev, ...newFiles]);
            setPerviewUrls(prev => [...prev, ...newPreviewUrls]);
    

        }
        catch(error){
            console.error('Error processing file:', error);
        }
        finally {
            // target.value = '';
        }
    }

    const removeImage = (index: number) =>{
        // setPerviewUrls(prev => prev.filter(item => item!= index))
        //like this (_,item) -> contert to index
        setPerviewUrls(prev => prev.filter((_,item) => item!= index));
        setImageFiles(prev => prev.filter((_,item) => item!= index));
    }

    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const onAddProductHanlder = async(): Promise<void> => {
        try{
            const isValid = await schemaValidation();
            if(!isValid){
                toast.error("Please fix the form errors");
                return
            }

            // Convert imageFiles to Base64
            const imageBase64Strings = await Promise.all(
                imageFiles.map(file => readAsBase64(file))
            );

            const createData: CreateProductInterface ={
                ...userData, 
                subCategories: selectedSubCategories,
                //farmerID get from current session
                farmerID: farmerID.toString(),
                // images: imageBase64Strings as string[]
                tags: selectedSubCategories,
                images: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wa8GvFFFKQP/2Q==']
            }

            console.log("CreateData: ", createData);

            // // const result = await createProduct(createData).unwrap();
            // const result = await createProduct(createData).unwrap();
            // console.log("Get result: ", result);
            
            const result = await createProduct(createData)
            .unwrap()
            .then(res => {
                console.log("Full Response:", res); // Debug line
                return res;
            })
            .catch(err => {
                console.error("RTK Error Details:", err); // Debug line
                throw err;
            });
            console.log("RESSSSSSSSSS: ", result);

            //await createProduct(createData); //will import laterconst result = await signUp(userData).unwrap();
            toast.success("Successfully product created")
        }
        catch(err){
            console.log("Global ERROR: ", err);
            //BUG ON BACKEND: instead of returning appropriate error with status code it's returning default 404 not found
            //status 400 expected for 'customer not found' error
            if(err.originalStatus === 404){ //fix it later
                setActionError("You cannot create product right now");
                toast.error("You cannot create product right now")
            }
        }
    }

    const onEditProductHanlder = async(): Promise<void> => {
        try{
            const isValid = await schemaValidation();
            if(!isValid){
                toast.error("Please fix the form errors");
                return
            }

            // const editData ={
                
            // }

            // const result = await updateProduct(editData).unwrap();
            // console.log("result");

            toast.success("Successfully product updated")

        }
        catch(err){
             console.log("Global ERROR: ", err);
            //BUG ON BACKEND: instead of returning appropriate error with status code it's returning default 404 not found
            //status 400 expected for 'customer not found' error
            if(err.originalStatus === 404){ //fix it later
                setActionError("You cannot edit product right now");
                toast.error("You cannot edit product right now")
            }
        }
    }

    return (
        <div className=' px-10 py-4 flex flex-col gap-8 bg-white'>
            <div className='flex justify-between mb-2'>
                <h2 className='text-xl font-medium'>
                    {`${mode === 'create' ?'AddProduct' : 'EditProduct'}`}
                </h2>
                <button className='' onClick={onCloseModal}>
                    X
                </button>
            </div>

            <div className=" mx-auto flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                    <label htmlFor="name" className="text-md font-medium text-gray-700">
                        Product Name
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-2
                            ${getBorderErrorStyle('name')}    
                        `}
                        id="name" 
                        name="name"
                        value={userData.name}
                        type="text"
                        placeholder="Enter Product Name"
                        onChange={handleChanges}
                    />
                    {validationErrors.name &&
                        <label className='text-red-600'> {validationErrors.name}</label>
                    }  
                </div>
                <div className="w-full sm:w-1/2">
                    <label htmlFor="category" className="text-md font-medium text-gray-700">
                    Category
                    </label>
                    <SelectField 
                        className={`
                            p-[9px] pl-4 bg-white text-greyB focus:border-2
                            ${getBorderErrorStyle('category')}
                        `}
                        id='category'
                        name='category'
                        value={userData.category}
                        options={categories}
                        onChange={handleChanges}
                    />
                    {validationErrors.name &&
                        <label className='text-red-600'> {validationErrors.category}</label>
                    } 
                </div>
            </div>

            <div className='flex flex-col'>
                <label htmlFor="sub-categories" className={'text-md font-medium text-gray-700'}>{`Atributes (sub categories)`}</label>
                {validationErrors.subCategories &&
                    <label className={`text-red-600 ${getBorderErrorStyle('subCategories')}`}> {validationErrors.subCategories}</label>
                } 
                <ul className='mt-2 bg-red w-full flex flex-wrap gap-4'>
                    {subCategories.map(subcategory => (
                        <li 
                            key={subcategory}
                            className={`
                                p-2 px-3 border border-greyB rounded-xl flex items-center cursor-pointer
                                ${selectedSubCategories.includes(subcategory) && 'bg-green1 border-green5 border'}
                                hover:bg-grey
                                
                            `} 
                            onClick={() => handleSubcategoryToggle(subcategory)} 
                        >
                            <div className={`
                                mr-2 rounded-full w-4 h-4 border border-greyB
                                ${selectedSubCategories.includes(subcategory) && 'bg-green4'}
                            `}/>
                            <div className='font-medium'>{subcategory}</div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mx-auto">
                <div className="w-full sm:w-1/3 ">
                    <label htmlFor="price" className="text-md font-medium text-gray-700">
                        Price
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-2
                            ${getBorderErrorStyle('price')}
                        `}
                        id="price" 
                        name="price"
                        value={userData.price ?? ''}
                        type="number"
                        placeholder="Enter Price"
                        onChange={handleChanges}
                    />
                    {validationErrors.price &&
                        <label className='text-red-600'> {validationErrors.price}</label>
                    }  
                </div>
                <div className="w-full sm:w-1/3">
                    <label htmlFor="unit" className="text-md font-medium text-gray-700">
                    Unit
                    </label>
                    <SelectField 
                        className={`
                            p-[9px] pl-4 bg-white text-greyB focus:border-2
                            ${getBorderErrorStyle('unit')}
                        `}
                        id='unit'
                        name='unit'
                        value={userData.unit ?? ''}
                        options={units}
                        onChange={handleChanges}
                    />
                    {validationErrors.unit &&
                        <label className='text-red-600'> {validationErrors.unit}</label>
                    } 
                </div>
                <div className="w-full sm:w-1/3">
                    <label htmlFor="stock" className="text-md font-medium text-gray-700">
                        Stock
                    </label>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-2
                            ${getBorderErrorStyle('stock')}
                        `}
                        id="stock" 
                        name="stock"
                        value={userData.stock ?? ''}
                        type="number"
                        placeholder="Enter Stock Amount"
                        onChange={handleChanges}
                    />
                    {validationErrors.stock &&
                        <label className='text-red-600'> {validationErrors.stock}</label>
                    }  
                </div>
            </div>

        

             <div className="w-full">
                <label htmlFor="shortDescription" className="text-md font-medium text-gray-700">
                    Short Description
                </label>
                <textarea
                    className={`
                        w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-2
                         ${getBorderErrorStyle('shortDescription')}
                    `}
                    id="shortDescription"
                    name="shortDescription"
                    value={userData.shortDescription}
                    placeholder="Enter a Short Description that will be displayed on products in market"
                    onChange={handleChanges}
                />
                {validationErrors.shortDescription &&
                    <label className='text-red-600'> {validationErrors.shortDescription}</label>
                }  
            </div>

            <div className="w-full ">
                <label htmlFor="description" className="text-md font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    rows={3}
                    className={`
                        w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm focus:border-green2 focus:border-2
                         ${getBorderErrorStyle('description')}
                    `}
                    id="description"
                    name="description"
                    value={userData.description}
                    placeholder="Enter a detailed description to be shown on the full profile"
                    onChange={handleChanges}
                />
                {validationErrors.description &&
                    <label className='text-red-600'> {validationErrors.description}</label>
                }  
            </div>

            <div className="w-full">
                <label htmlFor="images" className="text-md font-medium text-gray-700">
                    Images
                </label>
                <p className='py-1 text-xs text-gray-500'>The first image in the list will be used as the main display picture.</p>
                <div className={`w-full flex flex-wrap border-2 border-greyB rounded-md ${getBorderErrorStyle('images')}`}>
                    {/* File input hidden and triggered by the styled div(contected with input's 'id' and label's 'htmlFor') */}
                    <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="product-images-upload" 
                        >
                    </input>
                    <label htmlFor="product-images-upload" className='w-44 h-32 p-4 m-2 flex flex-col border border-greyB rounded-md bg-grey font-lato text-gray-500 cursor-pointer hover:bg-gray-300 hover:border-black group'>
                        <div className='mt-2 flex flex-col justify-center items-center'>
                            <img
                                src={uploadImage}
                                alt="upload"
                                className='w-6 h-6'
                            />
                            <div className='font-medium group-hover:text-black' onClick={() => handleFileChange}>Click to update</div>
                        </div>
                        <p className='mt-2 text-xs text-center group-hover:text-black'>SVG, PNG, JPG or GIF</p>
                    </label>

                    {/* Here is selected images (with same width/height) */}
                    {previewUrls.map((url, index) => (
                        <div key={`p-${index}`} className='w-44 h-32  m-2 flex flex-col border border-greyB rounded-md bg-grey font-lato text-gray-500  group'>
                        <div className='absolute flex flex-col justify-center items-center'>
                            <img
                                src={url}
                                alt="upload"
                                className='w-44 h-32 rounded-md'
                            />
                            <button className='absolute top-1 left-1 w-7 h-7 bg-white text-red-800 text-xs font-medium rounded-md cursor-pointer hover:text-red-900 hover:font-bold' onClick={() => removeImage(index)}>
                                X
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
                {validationErrors.images &&
                    <label className='text-red-600'> {validationErrors.images}</label>
                }
            </div>

            {mode === 'create' &&
            <div className='mx-auto'>
                <button className='p-2.5 px-12 bg-green4 font-popins font-medium text-sm rounded-md hover:bg-green5' onClick={onAddProductHanlder} >Add Product</button>
            </div>
            }
            {mode === 'edit' &&
            <div className='mx-auto'>
                <button className='p-2.5 px-12 bg-green4 font-popins font-medium text-sm rounded-md hover:bg-green5' onClick={onEditProductHanlder} >Edit Product</button>
            </div>
            }

        </div>
    )
}

export default ProductForm