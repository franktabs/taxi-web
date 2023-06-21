import { PropsWithChildren } from "react";
import ModalProviderContext from "./context/ModalProviderContext";
import UserAuthProviderContext from "./context/UserAuthProviderContext";
import { QueryClientProvider, QueryClient } from "react-query";



type Props = PropsWithChildren

const queryClient = new QueryClient();

export default function AllProvider({children}:Props) {
  return (
        <QueryClientProvider client = {queryClient}>
          <UserAuthProviderContext>
              <ModalProviderContext>
                  {children}
              </ModalProviderContext>
          </UserAuthProviderContext>
        </QueryClientProvider>

  )
}
