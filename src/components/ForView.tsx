import { FunctionComponent, PropsWithChildren } from "react";

type Props = PropsWithChildren;

const ForView:FunctionComponent<Props>=({children})=>{
    return (
        <div className=" p-5" >
            {children}
        </div>
    )
}

export default ForView;