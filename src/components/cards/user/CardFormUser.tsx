
import { BsFillPersonFill } from "react-icons/bs"
import $ from "jquery"
import { useCallback, ReactNode} from 'react';
import type { PropsTableUser, UserTableUser } from "../../table/TableUser";

type Props ={
    user: UserTableUser,
    title: PropsTableUser,
    isNew?:boolean
}
type Gens = {a:string}
type KeyUser = keyof UserTableUser;

let fr:Gens = {a:"arthuer"}


export default function CardFormUser({ user, title, isNew = false }:Props) {


    const handleClick = useCallback(() => {
        $(".container-modal").toggleClass("d-none")
    }, []);

    return (
        <div className=" bg-white"  >

            <div className=" position-relative" >
                <p style={{ marginLeft: "20px" }} className=" position-absolute bg-dark text-light p-3 d-inline-block rounded-3 translate-middle-y"  >
                    <span>
                        <BsFillPersonFill className=" fs-1" />
                    </span>
                </p>
            </div>
            <div className=" px-4 pt-5 table-responsive" style={{ maxHeight: "60vh" }} >
                <table className=" table" >
                    <thead>
                        <tr>
                            <th className=" text-info" style={{ fontSize: ".7em" }} >ATTRIBUTES</th>
                            <th className=" text-info text-center" style={{ fontSize: ".7em" }}  >VALUES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(user).map((value2:any, key) => {
                                var value: KeyUser = value2;

                                var tdInput:ReactNode = null;
                                if (title === "commerciaux") {
                                    if (value === "type") {
                                        tdInput = <select name="type" id="" className=" form-control form-select">
                                            <option value="freelance">Freelance</option>
                                            <option value="simple">Simple</option>
                                            <option value="chef">Chef</option>
                                        </select>
                                    } else if (value === "sexe") {
                                        tdInput = <select name="type" id="" className=" form-control form-select">
                                            <option value="Masculin">Masculin</option>
                                            <option value="Feminin">Feminin</option>
                                        </select>
                                    } else {
                                        tdInput = <input className=" form-control" type="text" name={value} value={user[value] || ""} placeholder={value.toUpperCase()} />
                                    }
                                } else {
                                    
                                    tdInput = user[value]
                                }


                                return (<tr key={value + key} className=" align-middle" >
                                    <th className=" text-uppercase" >
                                        {value}
                                    </th>

                                    <td>
                                        {tdInput}
                                    </td>
                                </tr>)
                            })
                        }
                        <tr>
                            <th>CNI</th>
                            <td>
                                <div className=" d-flex gap-2">
                                    <div style={{ width: "100px", height: "100px" }} className=" bg-dark d-flex align-items-center justify-content-center" >
                                        <p style={{ margin: 0 }} className=" text-white" >IMG</p>
                                    </div>
                                    <div style={{ width: "100px", height: "100px" }} className=" bg-dark d-flex align-items-center justify-content-center" >
                                        <p style={{ margin: 0 }} className=" text-white" >IMG</p>
                                    </div>
                                </div>
                            </td>

                        </tr>

                    </tbody>
                </table>
            </div>

            <div className="p-4 border-top border-2 border-dark">
                <div className=" d-flex gap-2 justify-content-end" >
                    {
                        title === "chauffeurs" ? <>
                            <button className=" btn btn-primary" onClick={handleClick} > Confirmer </button>
                            <button className=" btn btn-danger" onClick={handleClick} > Refuser </button>
                            <button className=" btn btn-dark" onClick={handleClick}> Annuler </button>
                        </>
                            :
                            <>
                                {
                                    !isNew ? <>
                                        <button className=" btn btn-primary" onClick={handleClick} > Modifier </button>
                                        <button className=" btn btn-danger" onClick={handleClick} > Supprimer </button>
                                    </> : <button className=" btn btn-primary" onClick={handleClick} > Enregistrer </button>
                                }

                                <button className=" btn btn-dark" onClick={handleClick}> Annuler </button>
                            </>
                    }
                </div>
            </div>
        </div>
    )
}
