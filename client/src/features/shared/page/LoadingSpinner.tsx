import { FC, ReactElement } from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingSpinner:FC = ():ReactElement => {

    return(
        <div className='mx-auto w-full flex text-center'>
            <FaSpinner className='text-white text-4xl mx-auto bg-none animate-spin'/>
        </div>
    )
}

export default LoadingSpinner;