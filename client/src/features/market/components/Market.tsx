import { FC, ReactElement, useEffect, useState } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { FilterInterface, SortInterface, SearchParamsInterface } from '../market.interface';
import Filter from './Filter';
import MarketSort from './MarketSort';
import MarketList from './MarketList';
import Pagination from '../../shared/page/Pagination';
import { useGetProductsSearchQuery } from '../../product/product.service';
import { useGetFarmersSearchQuery } from '../../farmer/farmer.service';
import { RiFilterLine } from "react-icons/ri";
import { RiFilterOffLine } from "react-icons/ri";

const Market:FC = ():ReactElement => {
    const [urlSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [filterDisplay, setFilterDisplay] = useState(true); 

    //the useEffect will be used to set searchParams on mode changes
    const mode = location.pathname.includes("farmers") ? "farmers" : "products";

    const [searchParams, setSearchParams] = useState<SearchParamsInterface>({
        mode: mode,
        sort: 'relevant',
        from:0,
        size: 12
    })

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1, //default
    })

    //depends on mode -> inital is products 
    const { data: productsResult, isLoading: isProductsLoading } = useGetProductsSearchQuery(
        { ...searchParams },
        { skip: searchParams.mode !== 'products' } // don’t run when farmers mode
    );

    const { data: farmersResult, isLoading: isFarmersLoading } = useGetFarmersSearchQuery(
        {
            from: searchParams.from,
            size: searchParams.size,
            farmerQuery: searchParams.farmerQuery
        },
        { skip: searchParams.mode !== 'farmers' } // don’t run when products mode
    );

    const isMarketItemsLoading = 
        searchParams.mode === 'products' ? isProductsLoading : isFarmersLoading

    useEffect(() => {
         setSearchParams(prev => ({
            ...prev,
            mode,
            from:0
        }))
    },[mode])

    useEffect(() => {
        let total = mode === 'products' 
            ? productsResult?.total ?? 0 
            : farmersResult?.total  ?? 0

        const isLoading = mode === 'products' ? !isProductsLoading : !isFarmersLoading;
        
        if(isLoading){
            const calculatedTotalPages = Math.ceil(total / searchParams.size!);
            setPagination(prev => ({ 
                ...prev,
                totalPages:calculatedTotalPages 
            }));
        }
    },[ 
        mode,
        productsResult?.total,
        farmersResult?.total,
        isProductsLoading,
        isFarmersLoading,
        searchParams.size
    ]);

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


    // Listen to URL changes (category/search) From Search and CategoryItem components
    // and update searchParams
    useEffect(() => {
        const category = urlSearchParams.get("category") ?? "";
        const searchText = urlSearchParams.get("search") ?? "";

        setSearchParams(prev => ({
            ...prev,
            category,
            query: searchText,
            from: 0,
        }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, [urlSearchParams]);

    //pass this to children and get retunrd filterData as prop
    const handleFilterApply = (filtersData: FilterInterface):void => {
        setSearchParams(prev => ({
            ...prev, 
            ...filtersData, 
            from:0,
        }))

        //this will trigger change mode to 'products'
        if(mode === 'farmers') navigate('/market');
    }

    const handleSortApply =(sortData: SortInterface ):void =>{
        setSearchParams(prev => ({
            ...prev, 
            ...sortData, 
        }))
    }

    const handleFarmerSerach = (query: string) => {
        setSearchParams(prev => ({
            ...prev,
            farmerQuery: query,
            mode:"farmers",
            from:0,
        }))
        setPagination(prev => ({ ...prev, currentPage: 1 }));
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

    // Change mode by navigating to the corresponding path; this triggers `mode` recalculation,
    // updates searchParams, and highlights the correct NavLink in the Header.tsx automatically.
    const handleDisplayModeChange = (mode: "products" | "farmers") => {     
        if(mode === "products")
            navigate("/market", { replace: true })
        else
            navigate('/farmers', { replace: true });
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

                {!isProductsLoading &&
                <MarketSort 
                    mode={searchParams.mode ?? 'products'}
                    onModeChange={handleDisplayModeChange}
                    onSortApply={handleSortApply}
                    onFarmerSearch={handleFarmerSerach}
                    productRelated={{
                        productsCount: productsResult?.total ?? 0,
                        productCategory: searchParams.category ?? ''
                    }}
                />
                }
                <div className='w-full px-2 pb-10 md:px-5'>
                    {(!isProductsLoading || !isFarmersLoading) &&
                    <>
                        <MarketList 
                            items={searchParams.mode === 'products' ? productsResult?.products ?? [] : farmersResult?.farmers ?? []}
                            mode={searchParams.mode ?? 'products'} //products or farmers
                            isLoading={isMarketItemsLoading}
                        />

                        {!isMarketItemsLoading && 
                            <div className='my-6 bg-red-100a w-full'>
                                <Pagination
                                    currentPage={pagination.currentPage} 
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        }   
                    </>
                    }
                </div>
            </section>
        </div>
    )
}

export default Market;