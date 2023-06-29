import { PropsWithChildren } from "react";
import ModalProviderContext from "./context/ModalProviderContext";
import UserAuthProviderContext from "./context/UserAuthProviderContext";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools"
import LoaderDualRing from "./components/loaders/LoaderDualRing";



type Props = PropsWithChildren

const queryClient = new QueryClient();

export type KeyUseQuery = "allUsersTable" | "usersTable";

export default function AllProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserAuthProviderContext>
        <ModalProviderContext>
          <LoaderDualRing/>
          {children}

        </ModalProviderContext>
      </UserAuthProviderContext>
      <ReactQueryDevtools />
    </QueryClientProvider>

  )
}
