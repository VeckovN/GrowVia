//Hook that is using to detect click outside of passed dropdown
import { useEffect, useState, RefObject } from 'react';

const useOnClickOutside = (
    // ref: RefObject<HTMLElement> | null,
    ref: RefObject<HTMLElement | null>,
    initialVisibility:boolean
): [boolean, (value: boolean) => void]  => {
    
    const [isVisible, setIsVisible] = useState(initialVisibility);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            //early return if 'ref' isn't attached or click occured inside the ref element
            if(!ref.current || ref.current.contains(event.target as Node)) 
                return;

            setIsVisible(false); //Always close on outside click
        }

        //Liste only when is Element visible (on open -> isVisible)
        if(isVisible){
            document.addEventListener('mousedown', handleClick, true);
        }

        //clean it on 
        return () => {
            document.removeEventListener('mousedown', handleClick, true);
        }

    },[ref, isVisible]);


    return [isVisible, setIsVisible];

}

export default useOnClickOutside;