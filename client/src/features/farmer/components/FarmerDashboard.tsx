import { FC } from 'react'

import FarmProductIcon from '../../../assets/farmers/FarmProduct.svg';

const FarmerDashboard:FC = () => {
    return (
        <div className='w-full bg-red-1001'>
            <h2 className='text-xl'>
                Dashboard
            </h2>

            <div className='mt-3'>
                <h3 className='py-4 text-center sm:text-left font-medium'> Products </h3>

                <div className='flex flex-col sm:flex-row justify-center items-center gap-2 lg:gap-5'>
                    <div className='px-12 py-3 border border-greyB rounded-md'>
                        <div className='text-center'>Total products</div>
                        <div className='w-full flex items-center'>
                            <img
                                className='w-10 h-10'
                                src={FarmProductIcon}
                                alt='logo'
                            />
                            <span className='font-semibold mx-auto'> 14</span>
                        </div>
                    </div>

                    <div className='px-12 py-3 border border-greyB rounded-md'>
                        <div className='text-center '>Total products</div>
                        <div className='flex items-center justify-around'>
                            <img
                                className='w-10 h-10'
                                src={FarmProductIcon}
                                alt='logo'
                            />
                            <span className='font-semibold'> 14</span>
                        </div>
                    </div>

                    <div className='px-12 py-3 border border-greyB rounded-md'>
                        <div className='text-center '>Total products</div>
                        <div className='flex items-center justify-around'>
                            <img
                                className='w-10 h-10'
                                src={FarmProductIcon}
                                alt='logo'
                            />
                            <span className='font-semibold'> 14</span>
                        </div>
                    </div>
                </div>
            </div>
                

        </div>
    )
}

export default FarmerDashboard;