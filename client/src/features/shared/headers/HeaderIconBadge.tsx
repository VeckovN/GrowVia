import {FC, ReactElement } from 'react';
import { HeaderIconBadgeInterface } from '../interfaces';

const HeaderIconBadge: FC<HeaderIconBadgeInterface> = ({
    icon,
    alt,
    content,
    text,
    className,
    textClassName,
    hiddenText = true,
    onClick
}): ReactElement => {
    return (
        <div className={`flex items-center mr-1 cursor-pointer group ${className}`} onClick={onClick}>
            <div className='relative group-hover:scale-105'>
                <img 
                    className='h-8 w-8'
                    src={icon}
                    alt={alt}
                />

                {content &&
                <div className='
                    absolute flex justify-center items-center rounded-full w-5 h-5 bg-green7 top-[-.5em] right-0
                    text-white text-xs font-semibold
                '>
                    {content}
                </div>
                }
            </div>

            {text && 
            <div className={`${hiddenText ? 'hidden' : 'flex'} md:flex md:ml-1 group-hover:text-gray-700 ${textClassName}`}>
                {/* user.username */}
                {text}
            </div>
            }
        </div>
    )
}


export default HeaderIconBadge;



{/* <div className='
    py-2 px-2 w-[260px] md:w-auto md:min-w-[300px] md:max-w-[500px] hidden sm:flex justify-center items-center bg-grey
    rounded-xl border-2 border-greyB
'></div> */}