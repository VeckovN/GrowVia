import { useRef} from 'react';
import useOnClickOutside from './useOnClickOutside';

const useNotificationsDropdown = ( ) => {
    const notificationsDropwdownRef = useRef<HTMLDivElement>(null);
    const [isNotificationsOpen, setIsNotificationsOpen] = useOnClickOutside(notificationsDropwdownRef, false);
    
    const toggleNotificationsDropdown = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
    }

    return {
        notificationsDropwdownRef, 
        isNotificationsOpen,
        toggleNotificationsDropdown
    }
}

export default useNotificationsDropdown;