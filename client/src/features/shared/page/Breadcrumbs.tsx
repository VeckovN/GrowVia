import React, { FC, ReactElement} from 'react';

import { GoChevronRight } from "react-icons/go";
import { BreadcrumbsPropsInterface } from '../interfaces';

const Breadcrumbs:FC<BreadcrumbsPropsInterface> = ({items}):ReactElement =>{

    return (
        <div className='flex items-center justify-center sm:justify-start gap-x-2  font-semibold'>
            {items.map((el,index) => 
            //React.Fragment cant accept props like 'key' which the <> </> 'shorthand' cannot
            <React.Fragment key={`${el.label}`}>  
                {index !== items.length -1 ? (
                    <>
                        <a href={el.href ?? ''}>{el.label}</a>
                        <GoChevronRight className='text-xl pl-[-20px]'/>
                    </>
                ): (
                    <a className='font-light'>{el.label}</a>
                )}
            </React.Fragment>
            )}
        </div>
    )
}

export default Breadcrumbs;