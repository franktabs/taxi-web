
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{id:string}>

export default function ModalDashboard({id,children}:Props) {
  return (
    <div className={`${id} d-none`} id={id} >
          {children}
      </div>
  )
}
