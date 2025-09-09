import { ChangeEvent, FC, ReactElement, useState } from "react"
import SelectField from "../../shared/inputs/SelectField";
import Breadcrumbs from "../../shared/page/Breadcrumbs";
import { SortInterface, SortPropInterface } from "../market.interface";
import { FiSearch } from "react-icons/fi";

const DEFAULT_PROPS: SortInterface = {
    sort: 'relevant',
    size: 12
}

const MarketSort:FC<SortPropInterface> = ({mode, onModeChange, onSortApply, onFarmerSearch, productRelated}):ReactElement => {
    const [options, setOptions] = useState<SortInterface>({...DEFAULT_PROPS});    
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearch = () => {
        onFarmerSearch(searchQuery);
    }

     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { 
            handleSearch();
        }
    };

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
        {label:'Show: 12', value: '12'},
        {label:'Show: 20', value: '20'},
        {label:'Show: 30', value: '30'}
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
        <div className="w-full lg:px-4 xl:px-9 flex flex-col bg-grey-200 my-5">
                            
            <div className='w-full'>
                <div className='px-5 lg:px-0 w-full flex flex-col md:flex-row items-center xl:justify-start gap-x-5 mb-3'>
                    <Breadcrumbs items={breadCrumbsItems} />
                    
                    {mode === 'products' 
                    ?
                        <div className='lg:hidden'>
                            <div>{productRelated.productsCount} <span>products available</span></div>
                        </div>
                    :
                         <div className='my-2 md:my-0 lg:hidden flex max-w-[240px] border border-greyB rounded-md py-2 px-3 justify-center items-center'>
                            <input
                                type='text'
                                value={searchQuery}
                                placeholder='Search for farmers'
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className='
                                    w-full text-sm placeholder:text-gray-600 bg-transparent
                                '
                            />
                            <button 
                                className='w-6 h-5 flex justify-center items-center bg-red-300a cursor-pointer'
                                onClick={() => handleSearch()}
                            >
                                <FiSearch />
                            </button>
                        </div>
                    }
                </div>

                <div className='w-full flex flex-col md:flex-row items-center justify-around lg:justify-between gap-y-4'>

                    <div className="flex gap-x-2 border border-greyB p-1 rounded-md">
                        <button 
                            className={`
                                p-[.4rem] text-sm bg-green4a px-8 rounded-md
                                ${mode === 'products' ? 'bg-green4' : 'border border-greyB'}
                            `} 
                            onClick={() => onModeChange('products')}>
                                Products
                        </button>
                        <button 
                            className={`
                                p-[.4rem] text-sm bg-green4a px-8 rounded-md
                                ${mode === 'farmers' ? 'bg-green4' : 'border border-greyB'}
                            `} 
                            onClick={() => onModeChange('farmers')}>
                                Farmers
                        </button>
                    </div>

                    {mode === 'products' 
                        ? 
                            <div className='hidden lg:block'>
                                <div>{productRelated.productsCount} <span>products available</span></div>
                            </div>
                        :
                            <div className='hidden lg:flex max-w-[240px] border border-greyB rounded-md py-2 px-3 justify-center items-center'>
                                <input
                                    type='text'
                                    value={searchQuery}
                                    placeholder='Search for farmers'
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className='
                                        w-full text-sm placeholder:text-gray-600 bg-transparent
                                    '
                                />
                                <button 
                                    className='w-6 h-5 flex justify-center items-center bg-red-300a cursor-pointer'
                                    onClick={() => handleSearch()}
                                >
                                    <FiSearch />
                                </button>
                            </div>
                    }

                    <div className='flex gap-x-1 xl:gap-x-2 h-[3.3em] text-sm'>
                        <SelectField 
                            className={`max-w-[9em] pl-3 text-start bg-white text-gray-500 rounded-xl`}
                            id='size'
                            name='size'
                            value={String(options.size ?? 12)}
                            options={sizeSelectOptions}
                            onChange={handleSelectChange}
                        />

                        {mode === 'products' && 
                            <SelectField 
                                className={`p-[11px] max-w-[10em] pl-3 bg-white text-gray-500 rounded-xl`}
                                id='sort'
                                name='sort'
                                value={options.sort ?? 'relevant'}
                                options={sortSelectOptions}
                                onChange={handleSelectChange}
                            />
                        }
                    </div>
                </div>
            </div>

        </div>
        
    )
}

export default MarketSort;