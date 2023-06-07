
import { ComponentType, createContext, useEffect, useState, useContext } from 'react';
import { PropsWithChildren, Dispatch, SetStateAction } from 'react';
import ModalDashboard from '../components/modal/ModalDashboard';


type ContextModal = {
  modal: JSX.Element | null,
  setModal: Dispatch<SetStateAction<JSX.Element | null>>
}

type Props = PropsWithChildren;

const modalContext = createContext<ContextModal>({ modal: null, setModal: () => { } });



export default function ModalProviderContext({ children }: Props) {



  const [modal, setModal] = useState<JSX.Element | null>(null);
  // useEffect(() => {
  //   setModal(<ModalDashboard />)
  // }, [])
  
  return (
    <modalContext.Provider value={{ modal, setModal }}>
      {children}
    </modalContext.Provider>
  )
}


export const useModal = () => {
  return useContext(modalContext);
}