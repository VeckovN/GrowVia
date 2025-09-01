import { FC, ReactElement } from 'react';
import { CategoryItemPropsInterface } from '../../shared/interfaces';

const CategoryItem:FC<CategoryItemPropsInterface> = ({name, icon, onCategoryClick}):ReactElement =>{    
    return(
        <div 
            className='
                group
                flex flex-col items-center justify-center w-[100px] h-[100px] xs:w-[120px] xs:h-[120px] min-w-[100px] min-h-[100px] border-2 border-greyB rounded-lg bg-white cursor-pointer
                hover:border-4 
            '
            onClick={onCategoryClick}
        >
            <div className='bg-category w-[70%] h-[70%] rounded-full border-2 flex items-center justify-center'>
                <img 
                    className='w-[80%] h-[80%] object-contain'
                    src={icon}
                    alt={name}
                />
            </div>

            <h3 className='text-xs xs:text-sm group-hover:font-semibold'>
                {name}
            </h3>
        </div>
    )
}

export default CategoryItem;