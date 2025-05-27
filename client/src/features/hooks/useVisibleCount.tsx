import { useState, useEffect } from 'react';

interface VisibleCountConfig {
    mobile: number,
    tablet: number,
    desktop: number
}

const defaultConfig: VisibleCountConfig = {
    mobile: 3,
    tablet: 2,
    desktop: 4
}

//<Partial> makes all properties optional
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
                const count =  width < 640 ? resolvedConfig.mobile //first check (if width<640 the .mobile will be return)
                            : width < 1024 ? resolvedConfig.tablet
                            : resolvedConfig.desktop;

                setVisibleCount(count);
            }, 10);
        };

        handleResize(); // Initial call
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [config]);

    return visibleCount;
}

export default useVisibleCount;
