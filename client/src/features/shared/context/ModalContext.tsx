import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { ProductDocumentInterface } from '../../product/product.interface';

//Ony one model open at a time 
type ModalType = 'add' | 'edit' | 'view' | 'delete' | null;

interface ModalContextInterface  {
    isOpen: boolean;
    modalData: { productID?: string, product?: ProductDocumentInterface}; //additional modal data (optional)
    activeModal: ModalType;
    openModal: (type: ModalType, data?: Record<string, unknown>) => void; 
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextInterface | undefined>(undefined);

export const ModalProvider = ({children}: {children: ReactNode}) => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [modalData, setModalData] = useState({}); 

    const openModal = (type: ModalType, data?: Record<string, unknown>):void => {
      setActiveModal(type);
      if(data)
        setModalData(data);
    }

    const closeModal = ():void =>{
      setActiveModal(null);
      setModalData({});
    }

    useEffect(() =>{
        if(activeModal !== null) { //only on open modal
            const originalStyle:string = document.body.style.overflow;
            //don't allow background scrolling
            //Direct Dom manipulation is ok ->  where it's done inside a useEffect
            document.body.style.overflow ='hidden';  

            return () =>{ //clean it -> on dependeny 'activeModal' changes or compnent unmount 
                document.body.style.overflow = originalStyle
            }
        }

    },[activeModal])

    return (
      <ModalContext.Provider
        value={{
          openModal,
          closeModal,
          isOpen: activeModal !== null,
          activeModal,
          modalData
        }}
      >
        {children}
      </ModalContext.Provider>
  );    
}

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};
