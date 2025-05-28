import { FC } from 'react';

import { CircleIconButtonInterface } from './interfaces';

const CircleArrowIconButton: FC<CircleIconButtonInterface> = ({
    onClick,
    children,
    className=''
}) =>{

    return(
        <button className={`
            w-10 h-10 mx-2 flex items-center justify-center text-center
            text-2xl 
            hover:scale-110 hover:shadow-md rounded-full hover:bg-grey 
            cursor-pointer
            ${className}`}
            onClick={onClick}
        > 
            {children}
        </button>
    )
}

export default CircleArrowIconButton;