
import { createContext, useState, useContext } from 'react';
import { PropsWithChildren, Dispatch, SetStateAction } from 'react';
import { Compte } from '../Models';


type ContextModal = {
    userAuth: { user: Compte | null }
    setUserAuth: Dispatch<SetStateAction<{ user: Compte | null }>>
}

type Props = PropsWithChildren;

const modalContext = createContext<ContextModal>({ userAuth: {user:null}, setUserAuth: () => { } });



export default function UserAuthProviderContext({ children }: Props) {



    const [userAuth, setUserAuth] = useState<{ user: Compte | null }>({user:null});
    // useEffect(() => {
    //   setModal(<ModalDashboard />)
    // }, [])

    return (
        <modalContext.Provider value={{ userAuth, setUserAuth}}>
            {children}
        </modalContext.Provider>
    )
}


export const useUserAuth = () => {
    return useContext(modalContext);
}