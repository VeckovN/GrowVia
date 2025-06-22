import { useState, useRef } from 'react';
import { FarmerProductsTableInterface } from '../../farmer.interface';
import useOnClickOutside from '../../../shared/hooks/useOnClickOutside';
import ActionDropdown from './ActionDropdown';
import Pagination from '../../../shared/page/Pagination';

import Fruit1Icon from '../../../../assets/products/strawberries.jpg'

const FarmerProductsTable = ({products} :{products: FarmerProductsTableInterface[]}) =>{
    const ActionDropdownRef = useRef<HTMLDivElement>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); //mark one of the clicked action (used to prevent )
    const [isActionOpen, setIsActionOpen] = useOnClickOutside(ActionDropdownRef, false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    //totalPages = productsLenght / itemsPerPage
    const [totalPage, setTotalPage] = useState<number>(2);
    const itemsPerPage = 10; //TotalPages

    //OpenModalBasedOnClickActionType

    const toggleActionDropdown = (productID: string): void => {
        setIsActionOpen(!isActionOpen);
        setOpenDropdownId(productID);
    }

    const changePageHandler = (page: number):void => {
        setCurrentPage(page);
    }

    return (
        <div>
            <table className='min-w-full border-b border-greyB'>
                <thead className='bg-grey'>
                    <tr>
                        <th className='px-2 py-3 text-left'>
                            <input
                                className='w-4 h-4 cursor-pointer'
                                type='checkbox'
                            />
                        </th>
                        <th className='p-2 whitespace-nowrap text-left text-sm font-medium'>
                            ID
                        </th>
                        <th className='px-2 py-3 text-left text-sm font-medium'>
                            Product
                        </th>
                        <th className='px-2 py-3 text-left text-sm font-medium'>
                            Category
                        </th>
                        <th className='hidden sm:table-cell px-2 py-3 text-left text-sm font-medium'>
                            Price
                        </th>
                        <th className='hidden sm:table-cell px-2 py-3 text-left text-sm font-medium'>
                            Stock
                        </th>
                        <th className='hidden sm:table-cell px-2 py-3 text-left text-sm font-medium'>
                            Unit
                        </th>
                        <th className='px-2 py-3 text-left text-sm font-medium'>
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody className='bg-white divide-y divide-greyB'>
                    {products.map((product) => (
                        <tr key={product.id} className=''>
                            <td className='px-2 py-3 '>
                                <input
                                    className='w-4 h-4 cursor-pointer'
                                    type='checkbox'
                                />
                            </td>
                            <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.id}
                            </td>
                            <td className="flex items-center gap-2 p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                <img 
                                    className='w-20 rounded-md'
                                    src={Fruit1Icon}
                                    alt='fruti1'
                                />
                                <span className='truncate'>{product.name}</span>
                            </td>
                            <td className="p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.category}
                            </td>
                            <td className="hidden sm:table-cell p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${product.price}
                            </td>
                            <td className="hidden sm:table-cell p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.stock}
                            </td>
                            <td className="hidden sm:table-cell p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {product.unit}
                            </td>
                            <td className="relative p-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                <button 
                                    className= {`
                                        text-center p-3 py-1 hover:bg-grey
                                        ${isActionOpen && openDropdownId === product.id && 'bg-gray-300'}
                                    `} 
                                    onClick={() => toggleActionDropdown(product.id)}
                                >...
                                </button>
                                {isActionOpen && openDropdownId === product.id &&
                                    <div ref={ActionDropdownRef} className='absolute top-10 right-20'>
                                        <ActionDropdown />
                                    </div>
                                }
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>

            <div className='mt-12'>
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPage}
                    onPageChange={changePageHandler}
                />
            </div>
        </div>
    )
}

export default FarmerProductsTable;