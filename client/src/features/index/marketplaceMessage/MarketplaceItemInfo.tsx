import {FC, ReactElement } from 'react';

import { MarketplaceInfoInterface } from '../../shared/interfaces';

const MarketplaceItemInfo: FC<MarketplaceInfoInterface> = ({title, description, icon}): ReactElement => {
    return (
        //Let parrent controll size -> here should be w-full used
        <div className='
            flex items-center bg-white border border-greyB rounded-lg px-2 py-4 w-full sm:py-2 sm:h-full md:py-4
        '>
            <img 
                className='w-16 h-16 mr-3'
                src={icon}
                alt={title}
            />
            <div className=''>
                <h3 className='font-medium text-lg'>{title}</h3>
                <div className='font-lato text-greyB text-sm'>{description}</div>
            </div>
        </div>
    )
}

export default MarketplaceItemInfo;
