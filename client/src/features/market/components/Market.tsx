import { FC, ReactElement, useEffect, useState } from 'react';
import { FilterInterface, SortInterface, SearchParamsInterface } from '../market.interface';
import Filter from './Filter';
import MarketSort from './MarketSort';
import MarketList from './MarketList';
import Pagination from '../../shared/page/Pagination';
import { useGetProductsSearchQuery } from '../../product/product.service';
import { RiFilterLine } from "react-icons/ri";
import { RiFilterOffLine } from "react-icons/ri";
import { FarmerDocumentInterface } from '../../farmer/farmer.interface';

const Market:FC = ():ReactElement => {
    const [farmers, setFarmers] = useState<FarmerDocumentInterface>({});
    const [filterDisplay, setFilterDisplay] = useState(true); 

    const [searchParams, setSearchParams] = useState<SearchParamsInterface>({
        mode: 'products',
        sort: 'relevant', //by default ->nothing ->by score in ElasticSearch
        from:0,
        size: 12
    })

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1, //default
    })

    const {data: productsResult, isLoading} = useGetProductsSearchQuery({
        ...searchParams
    });

    useEffect(() =>{
        if(!isLoading && productsResult?.total && searchParams.size){
            const calcucatedTotalPages = Math.ceil(productsResult.total / searchParams.size);
            setPagination(prev => ({
                ...prev,
                totalPages: calcucatedTotalPages
            }))
        }
    },[isLoading, productsResult?.total, searchParams.size]) //re-calucalte paddings totalPages on every 'product re-fetch', 'size changin'
    //fact: this useEffect will be trigger on every query reFetch because "isLoading" is set as dependencies (that is always changing on query execution)

    useEffect(() => {
        const filterDisplayRef = {current: filterDisplay}
    
        const handleResize = () => {
            if (window.innerWidth >= 768 && filterDisplayRef.current) {
                setFilterDisplay(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // }, [filterDisplay]); //on filterDisplay the handleResize will be re-created -> because we use !filterDisplay

    console.log("Data product: ", productsResult?.products);

    //this will get from RTQ isloading query
    const isMarketItemsLoading = false;

    //pass this to children and get retunrd filterData as prop
    const handleFilterApply = (filtersData: FilterInterface):void => {
        console.log("fitlerDATA: ", filtersData);
        setSearchParams(prev => ({
            ...prev, 
            ...filtersData, 
            from:0,
        }))
    }

    const handleSortApply =(sortData: SortInterface ):void =>{
        console.log("Sort Option", sortData);

        setSearchParams(prev => ({
            ...prev, //all other not sort related
            ...sortData, //sort related
        }))
    }

    //page:number is returned value from Pagination component on onClick=> OnPageChange 
    //Child(Pagination) triggers callback  → Parent(this component) updates state → New props go back down to child(Pagination)
    const handlePageChange = (newPage: number):void => {
        
        setPagination(prev => ({
            ...prev,
            currentPage: newPage
        }))
 
        //Refecth new products for new page -> 
        // change searchParams.from that automatically trigger re-fetching
        setSearchParams(prev => ({
            ...prev,
            from: (newPage - 1) * prev.size!
        }))   
    }

    return(
        <div className='w-full flex flex-col md:flex-row bg-white  '>
            <aside className='w-fulla order-1 sm:w-1/4a sm:max-w-[320px]a bg-red-400a'>
                {/* It's controlled compoenent (passed state and filterHandler func) */}
                {filterDisplay &&
                    <div className='mx-auto p-2 w-[90%]a max-w-[400px]'>
                        <Filter 
                            onFilterApply={handleFilterApply}
                        /> 
                    </div>
                }
            </aside>

            <section className='w-full order-2 bg-red-600a'>
                <div className='w-full md:hidden flex justify-center mt-2'>
                    <button 
                        className={`
                            flex justify-center items-center gap-x-2 font-lato p-2 px-3 text-md
                            border border-greyB rounded-md hover:bg-green2
                            ${filterDisplay && 'bg-green4 hover:bg-green5 hover:text-white'}
                        `}
                        onClick={() => setFilterDisplay(prev =>!prev)}
                    >

                        {filterDisplay ? <RiFilterOffLine /> : <RiFilterLine />}
                        Filter
                    </button>
                </div>

                {!isLoading &&
                <MarketSort 
                    onSortApply={handleSortApply}
                    productRelated={{
                        productsCount: productsResult?.total ?? 0,
                        productCategory: searchParams.category ?? ''
                    }}
                />
                }
                <div className='w-full px-2 md:px-5'>
                    {!isLoading &&
                    <>
                        <MarketList 
                            items={searchParams.mode === 'products' ? productsResult?.products : farmers}
                            mode={searchParams.mode ?? 'products'} //products or farmers
                            isLoading={isMarketItemsLoading}
                        />
                        <div className='my-6 bg-red-100a w-full'>
                            <Pagination
                                currentPage={pagination.currentPage} 
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                    }
                </div>
            </section>
        </div>
    )
}

export default Market;

