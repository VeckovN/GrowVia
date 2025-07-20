import { FC, ReactElement } from "react";
import { FaSpinner } from "react-icons/fa";

const LoadingSpinner:FC<{spinnerClassName?: string}> = ({spinnerClassName}):ReactElement => {

    return(
        <div className='mx-auto w-full flex text-center'>
            <FaSpinner className={`text-4xl mx-auto bg-none animate-spin ${spinnerClassName}`}/>
        </div>
    )
}

export default LoadingSpinner;