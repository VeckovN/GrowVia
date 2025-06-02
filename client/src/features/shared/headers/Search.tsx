import { FC, ReactElement, KeyboardEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";

import { productCategories } from '../utils/data';

const Search:FC = ():ReactElement => {
    
    const [selectedCategory, setSelectedCategory] = useState<string>('');
        const [searchQuery, setSearchQuery] = useState<string>('');
    
        console.log("SelectedCategory: " + selectedCategory + '\n ' + "searchQuery: " + searchQuery);
    
        const getSearchLink = () => {
            const params = new URLSearchParams();
            selectedCategory && params.append('category', selectedCategory);
            searchQuery && params.append('search', searchQuery);
    
            console.log("getSerachLink Params: ", params);
    
            return `/market?${params.toString()}`
        }
    
        //Handle Enter key press
        const handleKeyDown = (e: KeyboardEvent) =>{
            if(e.key ==='Enter' && (selectedCategory || searchQuery)){
                window.location.href = getSearchLink();
            }
        }

        return (
        <div className='py-2 px-2 mx-1 w-full flex justify-center items-center bg-grey rounded-xl border-2 border-greyB'>
            <select
                id='category'
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                onKeyDown={handleKeyDown}
                className='
                    w-[50%]  p-1 cursor-pointer focus:outline-none text-sm text-greyB bg-transparent 
                '
            >
                <option value=''>All Categories</option>
                {productCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                        {category.name}
                    </option>
                ))}

            </select>
            
            <div className='w-[50%] relative flex items-center'>
                <input
                    type='text'
                    value={searchQuery}
                    placeholder='Search Products'
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='
                        w-full pl-1 text-sm border-l-2  border-greyB bg-transparent
                    '
                />

                <Link
                    to={getSearchLink()}
                    className={`pl-1 cursor-pointer `}
                >
                    <FiSearch />
                </Link>
            </div>
        </div>

        )
}

export default Search