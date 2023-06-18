
import React from 'react'
import { PropsWithChildren } from 'react';


type Props = PropsWithChildren<
    {
        className?: string,
    }
> ;

export default function IconFloatUser({children, className}:Props) {
  return (
      <div className={" d-inline-block " + className} >
          <p className="bg-dark text-light d-flex justify-content-center align-items-center p-2 rounded-3"  >
              <span>
                  {children}
              </span>
          </p>
      </div>
  )
}
