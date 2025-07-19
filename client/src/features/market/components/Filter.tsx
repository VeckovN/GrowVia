import {FC, ReactElement, useMemo, useState, useEffect} from 'react';
import TextField from '../../shared/inputs/TextField';
import SelectField from '../../shared/inputs/SelectField';
import { UNIT_TYPES, CITIES, productCategories, categorySubcategoryMap } from '../../shared/utils/data';
import { FilterInterface, FilterPropInterface } from '../market.interface';

//TODO: Prevent re-rendering on other components renders -> 
// for example  MarketSort on re-render also trigger this Filter to be re-render

const Filter:FC<FilterPropInterface> = ({onFilterApply}):ReactElement => {
    const [selectedFilters, setselectedFilters] = useState<FilterInterface>({});

    console.log("Fukter: ", selectedFilters);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> ): void => {
        const { name, value, type } = e.target;

        if(type === 'checkbox' && name === 'subCategories'){
            //check e.target prop is only present in HTMLInputElement
            const target = e.target as HTMLInputElement;
            const checked = target.checked; 

            setselectedFilters(prev => {
                const current = prev.subCategories || [];
                const updated = checked
                    ? [...current, value]
                    : current.filter(item => item !== value);

                return {
                    ...prev,
                    subCategories: updated
                }
            })
        } else{
            setselectedFilters(prev => ({
                ...prev,
                [name]: value
            }));
        }       
    };

    const subCategoriesList = useMemo(() => {
        if(selectedFilters.category != '' && selectedFilters.category != undefined){
            const categoryString = selectedFilters.category;
            return categorySubcategoryMap[categoryString];
        }
        else
            return [];
    },[selectedFilters.category])

    const onFilterHanlder = ():void =>{
        //don't pass the empty values => category:''
         const cleanedFilters = Object.fromEntries(
            Object.entries(selectedFilters).filter(
                ([_, v]) => v !== undefined && (!Array.isArray(v) || v.length > 0)
            )
        );

        onFilterApply(cleanedFilters);
    }

    useEffect(()=>{
        if(!selectedFilters.category || selectedFilters.category === ''){
            setselectedFilters(prev => {
                const newFilters = { ...prev };
                delete newFilters.subCategories;
                return newFilters;
            })
        }
    },[selectedFilters.category])

    return (
        <div className='w-full sm:p-4 p-2 bg-grey rounded-xl flex flex-col gap-y-4'>
            
            <div className='w-full flex flex-col gap-y-1'>
                <label htmlFor="category" className="my-2 text-md font-semibold text-gray-700">
                Category
                </label>
                <SelectField 
                    className={`p-[11px] pl-4 bg-white text-gray-500 }`}
                    id='category'
                    name='category'
                    value={selectedFilters.category ?? ''}
                    options={productCategories.map(el => ({
                        key: el.name,
                        value: el.name,
                        label: el.name
                    }))}
                    onChange={handleChange}
                />
            </div>

            {selectedFilters.category !== '' && selectedFilters.category !== undefined &&
            <div className='w-full flex flex-col gap-y-1'>
                <label htmlFor="category" className="my-2 text-md font-semibold text-gray-700">
                Sub categories
                </label>
                <div className='flex flex-col'>
                {subCategoriesList?.map(sub => (
                    <label className='pl-4 flex items-center gap-x-2 '>
                        <input
                            className=''
                            type='checkbox'
                            name='subCategories'
                            value={sub}
                            // onChange={handleSubcategoriesChange}
                            onChange={handleChange}
                        />
                        {sub}
                    </label>      
                ))}
                </div>
            </div>
            }

            {/* Price Field for now -> refactor needs */}
            <div className='w-full flex flex-col gap-y-1'>
                <label htmlFor="price" className="my-2 text-md font-semibold text-gray-700">
                Price
                </label>
                <div className='flex gap-x-2'>
                    <TextField
                    className={`
                        w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                        focus:border-green2 focus:border-4
                    `}
                    id="price"
                    value={selectedFilters.priceFrom}
                    name="priceFrom"
                    type="number"
                    placeholder="Price From"
                    onChange={handleChange}
                    />
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                        `}
                        id="priceTo"
                        value={selectedFilters.priceTo}
                        name="priceTo"
                        type="number"
                        placeholder="Price To"
                        onChange={handleChange}
                    />
                </div>
            </div>

             <div className='w-full flex flex-col gap-y-1'>
                <label htmlFor="location" className="my-2 text-md font-semibold text-gray-700">
                Location
                </label>
                <SelectField 
                    className={`p-[11px] pl-4 bg-white text-gray-500 }`}
                    id='location'
                    name='location'
                    value={selectedFilters.location ?? ''}
                    options={CITIES}
                    onChange={handleChange}
                />
            </div>

            <div className='w-full flex flex-col gap-y-1'>
                <label htmlFor="price" className="my-2 text-md font-semibold text-gray-700">
                Quantity
                </label>
                <div className='flex  gap-x-2'>
                    <TextField
                        className={`
                            w-full p-2 pl-4 border-2 border-greyB rounded-md shadow-sm 
                            focus:border-green2 focus:border-4
                        `}
                        id="amount"
                        value={selectedFilters.priceFrom}
                        name="amount"
                        type="number"
                        placeholder="Amount"
                        onChange={handleChange}
                    />
                    <SelectField 
                        className={`p-[11px] pl-4 bg-white text-gray-500 }`}
                        id='location'
                        name='location'
                        value={selectedFilters.location ?? ''}
                        options={UNIT_TYPES.map(el => ({
                            key: el,
                            value: el,
                            label: el
                    }))}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className='pt-4 flex justify-center '>
                <button 
                    className='
                        border-2 border-greyBa bg-green5 py-2 w-36 max-w-[220px] text-white text-sm rounded-md
                        hover:bg-green6'
                    onClick={onFilterHanlder}
                    >
                    Apply
                </button>
            </div>
    
        </div>
    )
}

export default Filter