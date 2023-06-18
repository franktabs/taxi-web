
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren

export default function ModalDashboard({children}:Props) {
  return (
      <div className="container-modal d-none" id="container-modal" >
          {children}
      </div>
  )
}
