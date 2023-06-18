
import {  createContext, useState, useContext } from 'react';
import { PropsWithChildren, Dispatch, SetStateAction } from 'react';


type ContextModal = {
  modal: { value: JSX.Element | null}
  setModal: Dispatch<SetStateAction<{ value: JSX.Element | null }>>
}

type Props = PropsWithChildren;

const modalContext = createContext<ContextModal>({ modal: {value:null}, setModal: () => { } });



export default function ModalProviderContext({ children }: Props) {



  const [modal, setModal] = useState < { value:JSX.Element | null }>({value:null});
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