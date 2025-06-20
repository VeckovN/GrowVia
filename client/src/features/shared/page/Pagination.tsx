import { PaginationInterface } from "../interfaces";

const Pagination = ({currentPage, totalPages, onPageChange}: PaginationInterface) => {
    //totalPages is number => convert it to Array to enable using .map for returning pagination button pages
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1); //index 0 is '1' page

    return (
        <div className=''>
            <div className="flex">
                <button
                    //Apply left page of the current.  Math.max(1 , x) -> ensure the page never goes below 1
                    onClick={() => onPageChange(Math.max(1, currentPage -1 ))}
                    disabled={currentPage === 1}
                    className={`
                        text-center border border-greyB px-3 py-1 rounded-l-md disabled:opacity-50
                        ${currentPage !== 1 && 'hover:bg-gray-300' }
                    `}
                >
                    &lt; 
                </button>

                {pages.map(page  =>(
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`
                            text-center border border-greyB px-3 py-1 hover:bg-gray-300 hover:text-black
                            ${page === currentPage && 'bg-gray-400 text-white font-medium'}
                        `}
                    >
                    {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`
                        text-center border border-greyB px-3 py-1 rounded-r-md disabled:opacity-50
                        ${currentPage !== totalPages && 'hover:bg-gray-300' }
                    `}
                >
                    &gt; 
                </button>
            </div>
        </div>
    )
}

export default Pagination;