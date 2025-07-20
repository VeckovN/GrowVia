import { ReactNode } from "react"

const Modal = ({children, closeModal}: {children: ReactNode, closeModal:()=>void}) => {

    return (
        <div className='fixed inset-0 z-50 overflow-y-auto '>
            <div 
                className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
                onClick={closeModal}
            />
            {/* Modal Container */}
            <div className='flex min-h-full items-center justify-center p-4 text-center '>
                <div className='w-full max-w-[700px] relative transform overflow-hidden rounded-lg bg-whit text-left shadow-xl transition-all'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal