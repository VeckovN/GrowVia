import { ChangeEvent, FC, ReactElement, useState, useEffect } from "react"
import SelectField from "../../shared/inputs/SelectField";
import Breadcrumbs from "../../shared/page/Breadcrumbs";
import { SortInterface, SortPropInterface, ProductRelatedPropsInterface } from "../market.interface";

const DEFAULT_PROPS: SortInterface = {
    mode: 'products',
    sort: 'relevant',
    size: 12
}

const MarketSort:FC<SortPropInterface> = ({onSortApply, productRelated}):ReactElement => {
    const [options, setOptions] = useState<SortInterface>({...DEFAULT_PROPS});    

    console.log("OPTIONS: ", options);

    const handleDisplayModeChange = (mode: 'products' | 'farmers'):void => {

        const sortData:SortInterface = {
            ...DEFAULT_PROPS,
            mode   
        }
        setOptions(sortData); //trigger changing here in component
        onSortApply(sortData); //send same data to the market (parent) component to trigger items re-fetching
    } 

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>):void => {
        const { name, value } = e.target;

         const sortData:SortInterface = {
            ...options,
            [name]: value
        }

        setOptions(prev => ({
            ...prev,
            [name]: value
        }))

        onSortApply(sortData);
    }
    
    const sizeSelectOptions = [
        {label:'Show: 12', value: 12},
        {label:'Show: 20', value: 20},
        {label:'Show: 30', value: 30}
    ]

    const sortSelectOptions = [
        {label:'Most relevant', value: 'relevant'},
        {label:'Price->Low', value: 'price_asc'},
        {label:'Price->High', value: 'price_desc'},
        {label:'New Products', value: 'newest'},
    ]
    
    const breadCrumbsItems = [
        {label: "Home", href: '/'},
        {label: "Market", href: '/market'},
        ...(productRelated?.productCategory
        ? [{ label: productRelated?.productCategory, href: `/market/${productRelated.productCategory}` }]
        : [])
    ] 

    return (
        <div className="w-full bg-red-300a flex flex-col  bg-grey-200 my-5">
                            
            <div className='w-full flex flex-col md:flex-row items-center xl:justify-start mb-3'>
                <Breadcrumbs items={breadCrumbsItems} />
                
                <div className='xl:hidden pl-10'>
                    <div>{productRelated.productsCount} <span>products available</span></div>
                </div>
            </div>

            <div className='w-full flex flex-col md:flex-row items-center justify-around'>

                <div className="flex gap-x-2 border border-greyB p-1 rounded-md">
                    <button 
                        className={`
                            p-[.4rem] text-sm bg-green4a px-8 rounded-md
                            ${options.mode === 'products' ? 'bg-green4' : 'border border-greyB'}
                        `} 
                        onClick={() => handleDisplayModeChange('products')}>
                            Products
                    </button>
                    <button 
                        className={`
                            p-[.4rem] text-sm bg-green4a px-8 rounded-md
                            ${options.mode === 'farmers' ? 'bg-green4' : 'border border-greyB'}
                        `} 
                        onClick={() => handleDisplayModeChange('farmers')}>
                            Farmers
                    </button>
                </div>

                <div className='hidden xl:block'>
                    <div>{productRelated.productsCount} <span>products available</span></div>
                </div>

                <div className='flex w-fulla h-12 text-sm'>
                    <SelectField 
                        className={`max-w-[9em] text-start bg-white text-gray-500 rounded-xl`}
                        id='size'
                        name='size'
                        value={options.size}
                        options={sizeSelectOptions}
                        onChange={handleSelectChange}
                    />
                    <SelectField 
                        className={`p-[11px] max-w-[10em] pl-4 bg-white text-gray-500 rounded-xl`}
                        id='sort'
                        name='sort'
                        value={options.sort}
                        options={sortSelectOptions}
                        onChange={handleSelectChange}
                    />
                </div>
            </div>

        </div>
        
    )
}

export default MarketSort;