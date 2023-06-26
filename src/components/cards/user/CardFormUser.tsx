
import { BsFillPersonFill } from "react-icons/bs"
import $ from "jquery"
import { useCallback, ReactNode, useMemo, MouseEvent } from 'react';
import { excludeColumn, PropsTableUser, UserTableUser } from "../../table/TableUser";
import { booleanString } from "../../../utils";
import { doc, DocumentReference, Timestamp, updateDoc } from "firebase/firestore";
import { useUserAuth } from "../../../context/UserAuthProviderContext";
import { Commercial, Compte } from "../../../Models";
import { Administrateur } from '../../../Models/Administrateur';
import { db } from "../../../firebase";
import { Chauffeur } from '../../../Models/Chauffeur';
import { ChauffeurAttr, CommercialAttr } from '../../../Models/type';
import Swal from "sweetalert2";

type Props = {
    user: UserTableUser,
    title: PropsTableUser,
    isNew?: boolean,
    setRefresh?: React.Dispatch<React.SetStateAction<{ val: boolean }>>
}

const actionButton = ["Annuler", "ValiderChauffeur", "RefuserChauffeur", "AccesAuCommercial", "ModifierCommercial", "SuspendreCommercial"] as const
type ElmtActionButton = typeof actionButton[number]

export default function CardFormUser({ user, title, isNew = false, setRefresh }: Props) {

    type KeyUser = keyof (typeof user.compte);

    const { userAuth } = useUserAuth()

    const handleClick = useCallback((action: ElmtActionButton) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        let userDocRef: DocumentReference
        if (user.compte.id) {
            if (title === "chauffeurs") {
                userDocRef = doc(db, "chauffeur", user.compte.id as string)
            } else if (title === "commerciaux") {
                userDocRef = doc(db, "commercial", user.compte.id as string)
            }
        }



        const handleAction: { [P in ElmtActionButton]: (e?: MouseEvent) => void } = {
            "Annuler": () => { $(".container-modal").toggleClass("d-none") },
            "RefuserChauffeur": async () => {
                if (!!userDocRef) {
                    var dataUpdate: { [key in keyof ChauffeurAttr]?: ChauffeurAttr[key] extends boolean ? boolean : never }
                    dataUpdate = { access: false, treated: true }
                    console.log(dataUpdate);
                    const updateUser = await updateDoc(userDocRef, dataUpdate)
                    console.log("updateUser", updateUser);
                    if (setRefresh) setRefresh({ val: true })
                    $(".container-modal").toggleClass("d-none")

                    Toast.fire({
                        icon: "success",
                        title: 'Action réussi'
                    })
                }
            },
            "ValiderChauffeur": async () => {
                if (!!userDocRef) {
                    var dataUpdate: { [key in keyof ChauffeurAttr]?: ChauffeurAttr[key] extends boolean ? boolean : never }
                    dataUpdate = { access: true, treated: true }
                    console.log(dataUpdate);
                    const updateUser = await updateDoc(userDocRef, dataUpdate)
                    console.log("updateUser", updateUser);
                    if (setRefresh) setRefresh({ val: true })
                    $(".container-modal").toggleClass("d-none")

                    Toast.fire({
                        icon: "success",
                        title: 'Action réussi'
                    })
                }
            },
            "ModifierCommercial": () => {
                $(".container-modal").toggleClass("d-none")
            },
            "SuspendreCommercial": async () => {
                if (!!userDocRef) {
                    var dataUpdate: { [key in keyof CommercialAttr]?: CommercialAttr[key] extends boolean ? boolean : never }
                    dataUpdate = { access: false }
                    console.log(dataUpdate);
                    const updateUser = await updateDoc(userDocRef, dataUpdate)
                    console.log("updateUser", updateUser);
                    if (setRefresh) setRefresh({ val: true })
                    $(".container-modal").toggleClass("d-none")

                }
            },
            "AccesAuCommercial": async () => {
                if (!!userDocRef) {
                    var dataUpdate: { [key in keyof CommercialAttr]?: CommercialAttr[key] extends boolean ? boolean : never }
                    dataUpdate = { access: true }
                    console.log(dataUpdate);
                    const updateUser = await updateDoc(userDocRef, dataUpdate)
                    console.log("updateUser", updateUser);
                    if (setRefresh) setRefresh({ val: true });
                    $(".container-modal").toggleClass("d-none")

                }
            }

        }

        return handleAction[action]
    }, [title, setRefresh, user]);

    const ligneBody = useMemo(() => {
        let ligneValue = { ...user.compte }
        excludeColumn.forEach((elm) => {
            delete ligneValue[elm as (keyof (typeof ligneValue))];
        })

        return Object.keys(ligneValue).map((value2: any, key) => {
            var value: KeyUser = value2;

            var tdInput: ReactNode = null;
            // if (title === "commerciaux") {
            //     if (value === "type") {
            //         tdInput = <select name="type" id="" className=" form-control form-select">
            //             <option value="freelance">Freelance</option>
            //             <option value="simple">Simple</option>
            //             <option value="chef">Chef</option>
            //         </select>
            //     } else if (value === "sexe") {
            //         tdInput = <select name="sexe" id="" className=" form-control form-select">
            //             <option value="M">Masculin</option>
            //             <option value="F">Feminin</option>
            //         </select>
            //     } else {
            //         tdInput = <input className=" form-control" type="text" name={value} value={ligneValue[value] as any || ""} placeholder={value.toUpperCase()} />
            //     }
            // } 
            if(title==="commerciaux" || title ==="chauffeurs") {
                if (ligneValue[value] instanceof Timestamp) {
                    let timestamp = ligneValue[value] as Timestamp;
                    tdInput = timestamp?.toDate().toLocaleDateString();
                } else {
                    tdInput = booleanString(ligneValue[value]) as any;
                }
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



    }, [title, user]);

    const groupButton = useMemo(() => {
        let group = null
        if (title === "chauffeurs") {
            var userCompte = user as Chauffeur
            console.log("open chauffeur form", userAuth);
            if (userAuth.user instanceof Commercial) {
                group = <>
                    {/* <button className=" btn btn-primary" onClick={handleClick} > Modifier </button> */}
                    <button className=" btn btn-dark" onClick={handleClick("Annuler")}> Annuler </button>
                </>
            } else if (userAuth.user instanceof Administrateur) {

                if (userCompte.compte.treated && userCompte.compte.access) {
                    group = <>
                        <button className=" btn btn-danger" onClick={handleClick("RefuserChauffeur")} > Suspendre </button>
                        <button className=" btn btn-dark" onClick={handleClick("Annuler")}> Annuler </button>
                    </>
                } else if (userCompte.compte.treated && !userCompte.compte.access) {
                    group = <>
                        <button className=" btn btn-success" onClick={handleClick("ValiderChauffeur")} > Donner Accès </button>
                        <button className=" btn btn-dark" onClick={handleClick("Annuler")}> Annuler </button>
                    </>
                } else if (!userCompte.compte.treated) {
                    group = <>
                        <button className=" btn btn-success" onClick={handleClick("ValiderChauffeur")} > Valider </button>
                        <button className=" btn btn-danger" onClick={handleClick("RefuserChauffeur")} > Refuser </button>
                        <button className=" btn btn-dark" onClick={handleClick("Annuler")}> Annuler </button>
                    </>
                }

            }
        } else if (title === "commerciaux") {
            group = <>
                <button className=" btn btn-primary" onClick={handleClick("ModifierCommercial")} > Modifier </button>
                {

                    user.compte.access ?
                        <button className=" btn btn-danger" onClick={handleClick("SuspendreCommercial")} > Suspendre </button>
                        :
                        <button className=" btn btn-success" onClick={handleClick("AccesAuCommercial")} > Donner Accès </button>

                }
                <button className=" btn btn-dark" onClick={handleClick("Annuler")}> Annuler </button>
            </>
        }
        return group;
    }, [title, handleClick, userAuth, user])

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
                            ligneBody
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
                        // title === "chauffeurs" ? <>
                        //     <button className=" btn btn-primary" onClick={handleClick} > Valider </button>
                        //     <button className=" btn btn-danger" onClick={handleClick} > Refuser </button>
                        //     <button className=" btn btn-dark" onClick={handleClick}> Annuler </button>
                        // </>
                        //     :
                        //     <>
                        //         {
                        //             <!isNew ? <>
                        //                 <button className=" btn btn-primary" onClick={handleClick} > Modifier </button>
                        //                 <button className=" btn btn-danger" onClick={handleClick} > Supprimer </button>
                        //             </> : <button className=" btn btn-primary" onClick={handleClick} > Enregistrer </button>
                        //         }

                        //         <button className=" btn btn-dark" onClick={handleClick}> Annuler </button>
                        //     </>

                        groupButton
                    }
                </div>
            </div>
        </div>
    )
}
