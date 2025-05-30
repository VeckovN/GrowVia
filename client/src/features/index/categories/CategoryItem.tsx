import { FC, ReactElement } from 'react';
import { productCategoriesInterface } from '../../shared/utils/data';


const CategoryItem:FC<productCategoriesInterface> = ({id, name, icon}):ReactElement =>{
    return(
        //use 'group' - 'group-hover' utill class to make h3 text bold on hovers over the root <div>
        <div 
            key={id}
            className='
                group
                flex flex-col items-center justify-center w-[120px] h-[120px] min-w-[100px] min-h-[100px] border-2 border-greyB rounded-lg bg-white cursor-pointer
                hover:border-4 
            '
            onClick={()=>alert(`category: ${name}`)}
        >
            <div className='bg-category w-[70%] h-[70%] rounded-full border-2 flex items-center justify-center'>
                <img 
                    className='w-[80%] h-[80%] object-contain'
                    src={icon}
                    alt={name}
                />
            </div>

            <h3 className='text-sm group-hover:font-semibold'>
                {name}
            </h3>
        </div>
    )
}

export default CategoryItem;