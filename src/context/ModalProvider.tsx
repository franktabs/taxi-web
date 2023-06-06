
import {ComponentType, createContext, useState, useContext} from 'react';
import { PropsWithChildren, Dispatch, SetStateAction } from 'react';


type ContextModal = {
    modal: ComponentType | null,
    setModal: Dispatch<SetStateAction <ComponentType | null>>
}

type Props = PropsWithChildren;

const modalContext = createContext<ContextModal>({ modal: null, setModal: () => { } });



export default function ModalProvider({children}:Props) {
    const [modal, setModal] = useState<ComponentType | null>(null);
  return (
    <modalContext.Provider value={{ modal, setModal }}>
        {children}
    </modalContext.Provider>
  )
}


export const useModal = ()=>{
    return useContext(modalContext);
}