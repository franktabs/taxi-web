
import { BsFillPersonFill } from "react-icons/bs";
import { BsFillTaxiFrontFill } from "react-icons/bs";


type Props = {
    className?:string
}

export default function IconChauffeur({className=""}:Props) {
    return (
        <div className={" d-inline-block "+className} >
            <p className="bg-dark text-light d-flex justify-content-center align-items-center p-2 rounded-3"  >
                <span className=" fs-2 text-warning"  >
                    <BsFillPersonFill />
                    <BsFillTaxiFrontFill className="fs-1" />
                </span>
            </p>
        </div>
        
    )
}
