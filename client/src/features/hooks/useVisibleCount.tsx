import { useState, useEffect } from 'react';
import { VisibleCountConfig } from '../shared/interfaces';

const defaultConfig: VisibleCountConfig = {
    mobile: 3,
    tablet: 2,
    desktop: 4
}

const useVisibleCount = (config: Partial<VisibleCountConfig> = {}) => {
    const [visibleCount, setVisibleCount] = useState(config.mobile || defaultConfig.mobile);

    const resolvedConfig = {
        mobile: config.mobile ?? defaultConfig.mobile, //if config.mobile not exist take the defaultConfig.mobile
        tablet: config.tablet ?? defaultConfig.tablet,
        desktop: config.desktop ?? defaultConfig.desktop
    }

    useEffect(() => {
        let timeoutId: any;

        const handleResize = () => {
            if (typeof window === 'undefined') return;
            
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const width = window.innerWidth;             
                const count =  width < 640 ? resolvedConfig.mobile
                            : width < 1024 ? resolvedConfig.tablet
                            : resolvedConfig.desktop;

                setVisibleCount(count);
            }, 10);
        };

        handleResize(); 
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [config]);

    return visibleCount;
}

export default useVisibleCount;