
import { BsFillPersonFill } from "react-icons/bs"
import $ from "jquery"
import { useCallback, ReactNode, useMemo, MouseEvent, useState } from 'react';
import { excludeColumn, includeURLImage, keyAllUsersTable, PropsTableUser, UserTableUser } from "../../table/TableUser";
import { booleanString } from "../../../utils";
import { doc, DocumentReference, Timestamp, updateDoc } from "firebase/firestore";
import { useUserAuth } from "../../../context/UserAuthProviderContext";
import { Commercial, Compte } from "../../../Models";
import { Administrateur } from '../../../Models/Administrateur';
import { db } from "../../../firebase";
import { Chauffeur } from '../../../Models/Chauffeur';
import { ChauffeurAttr, CommercialAttr, ModelAttr } from '../../../Models/type';
import Swal from "sweetalert2";
import ModalDashboard from '../../modal/ModalDashboard';
import { useForm } from 'react-hook-form';
import ContainerForm from '../../../pages/autthentication/components/ContainerForm';
import { Button } from '@mui/material';
import { useQuery } from 'react-query';
import { useQueryClient } from 'react-query';
import DisplayImage from "../../img/DisplayImage";
import { stat } from "fs";

type Props = {
    user: UserTableUser,
    title: PropsTableUser,
    isNew?: boolean,
    setRefresh?: React.Dispatch<React.SetStateAction<{ val: boolean }>>
    modal?:boolean
}

const actionButton = ["Annuler", "ValiderChauffeur", "RefuserChauffeur", "AccesAuCommercial", "ModifierCommercial", "SuspendreCommercial", "ModifierChauffeur"] as const
type ElmtActionButton = typeof actionButton[number]

export default function CardFormUser({ user, title, isNew = false, setRefresh, modal=true }: Props) {

    const queryClient = useQueryClient();

    type KeyUser = keyof (typeof user.compte);

    const [ userModal, setUserModal] = useState(user)
    const { userAuth } = useUserAuth();

    const [allUsersTable, setAllUsersTable] = useState<Compte[] | null>(null);
    const [enableQueryAllUsersTable, setEnableQueryAllUsersTable] = useState(false);

    
    const defaultValuesForm = useMemo(() => {
        let compte = { ...user.compte };
        for (let key in compte) {
            let k: keyof (typeof compte) = key as any
            let timestamp = compte[k];


            if (timestamp instanceof Timestamp) {
                let date = timestamp.toDate() as any
                var year = date.getFullYear();
                var month = ("0" + (date.getMonth() + 1)).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
                var formattedDate = year + "-" + month + "-" + day;
                //@ts-ignore
                compte[k] = formattedDate

            }

        }
        console.log("defaultVaaaaaaalue", compte);
        return compte;

    }, [user])

    const { register, handleSubmit, reset, formState } = useForm<ModelAttr>({ defaultValues: defaultValuesForm })


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
                    setUserModal(state => {
                        let ancienstate = state;
                        ancienstate.compte = {...state.compte,...dataUpdate}
                        return ancienstate
                    });
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
                    setUserModal(state => {
                        let ancienstate = state;
                        ancienstate.compte = { ...state.compte, ...dataUpdate }
                        return ancienstate
                    });
                    Toast.fire({
                        icon: "success",
                        title: 'Action réussi'
                    })
                }
            },
            "ModifierCommercial": () => {
                $(".container-modal3").toggleClass("d-none")
            },
            "ModifierChauffeur": ()=>{
                $(".container-modal3").toggleClass("d-none")
            },
            "SuspendreCommercial": async () => {
                if (!!userDocRef) {
                    var dataUpdate: { [key in keyof CommercialAttr]?: CommercialAttr[key] extends boolean ? boolean : never }
                    dataUpdate = { access: false }
                    console.log(dataUpdate);
                    const updateUser = await updateDoc(userDocRef, dataUpdate)
                    console.log("updateUser", updateUser);
                    setUserModal(state => {
                        let ancienstate = state;
                        ancienstate.compte = { ...state.compte, ...dataUpdate }
                        return ancienstate
                    });
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
                    setUserModal(state => {
                        let ancienstate = state;
                        ancienstate.compte = { ...state.compte, ...dataUpdate }
                        return ancienstate
                    });
                    if (setRefresh) setRefresh({ val: true });
                    $(".container-modal").toggleClass("d-none")

                }
            }

        }

        return handleAction[action]
    }, [title, setRefresh, user]);

    useQuery([keyAllUsersTable], async () => {
        if (title === "chauffeurs") {
            let chauffeurs = await Chauffeur.findAll();
            setAllUsersTable(chauffeurs);
        } else if (title === "commerciaux") {
            let chauffeurs = await Commercial.findAll();
            setAllUsersTable(chauffeurs);
        }
        setEnableQueryAllUsersTable(false);
    }, { enabled: enableQueryAllUsersTable });


    // const handleSubmitModal = useCallback(async (data: any) => {

    //     const Toast = Swal.mixin({
    //         toast: true,
    //         position: 'top-end',
    //         showConfirmButton: false,
    //         timer: 3000,
    //         timerProgressBar: true,
    //         didOpen: (toast) => {
    //             toast.addEventListener('mouseenter', Swal.stopTimer)
    //             toast.addEventListener('mouseleave', Swal.resumeTimer)
    //         }
    //     })

    //     // const formdata = new FormData(document.getElementById("formLogin") as HTMLFormElement);
    //     // const data = Object.fromEntries(formdata.entries())
    //     console.log("data du form", data);
    //     let instanceUser: Compte | null = null;
    //     let isEmpty = false;
    //     Object.values(data).forEach((val, key) => {
    //         if (!val) {
    //             isEmpty = true;
    //         }
    //     });

    //     if (isEmpty) {
    //         Toast.fire({
    //             icon: "error",
    //             title: 'Tous les champs sont obligatoire'
    //         })
    //         return
    //     }
    //     // event.preventDefault();
    //     console.log("title handleClick ", title);
    //     if (title === "chauffeurs") {
    //         if (userAuth.user instanceof Commercial) {
    //             instanceUser = await Chauffeur.saveFirebase({ dataForm: data, commercial_id: userAuth.user.compte.id });
    //         }
    //     } else if (title === "commerciaux") {
    //         if (userAuth.user instanceof Administrateur) {
    //             instanceUser = await Commercial.saveFirebase({ dataForm: data, administrateur_id: userAuth.user.compte.id });
    //         }
    //     }

    //     if (instanceUser != null) {

    //         queryClient.invalidateQueries([keyAllUsersTable]);
    //         // setRefresh({ val: true })
    //         $(".container-modal3").toggleClass("d-none")
    //         // setModal({ value: <div></div> })
    //         reset()
    //         Toast.fire({
    //             icon: "success",
    //             title: 'inscription réussi'
    //         })

    //     } else {
    //         console.log("inscription échoué");


    //         Toast.fire({
    //             icon: "error",
    //             title: 'Erreur inscription'
    //         })
    //     }
    // }, [userAuth, title, queryClient, reset])

    const handleSubmitModal = useCallback((data:any)=>{
        $(".container-modal3").toggleClass("d-none")
    }, [])

    const ligneBody = useMemo(() => {
        let ligneValue = { ...userModal.compte }
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
            if (title === "commerciaux" || title === "chauffeurs") {
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



    }, [title, userModal]);

    const groupButton = useMemo(() => {
        let group = null
        if (title === "chauffeurs") {
            var userCompte = userModal as Chauffeur
            console.log("open chauffeur form", userAuth);
            if (userAuth.user instanceof Commercial) {
                let subgroup = null
                if (userCompte.compte.treated && userCompte.compte.access) {
                    subgroup = <>
                        <button className=" btn btn-danger" onClick={handleClick("RefuserChauffeur")} > Suspendre </button>
                        
                    </>
                } else if (userCompte.compte.treated && !userCompte.compte.access) {
                    subgroup = <>
                        <button className=" btn btn-success" onClick={handleClick("ValiderChauffeur")} > Donner Accès </button>
                        
                    </>
                }else{
                    subgroup = <>
                        
                    </>
                }
                if(modal){
                    group = <>
                        {subgroup}
                        <button className=" btn btn-dark" onClick={handleClick("Annuler")}> Annuler </button>
                    </>
                }
                else{
                    group = subgroup;
                }
            } else if (userAuth.user instanceof Administrateur) {
                let subgroup = null;
                if (userCompte.compte.treated && userCompte.compte.access) {
                    subgroup = <>
                        <button className=" btn btn-danger" onClick={handleClick("RefuserChauffeur")} > Suspendre </button>
                        
                    </>
                } else if (userCompte.compte.treated && !userCompte.compte.access) {
                    subgroup = <>
                        <button className=" btn btn-success" onClick={handleClick("ValiderChauffeur")} > Donner Accès </button>
                        
                    </>
                } else if (!userCompte.compte.treated) {
                    subgroup = <>
                        <button className=" btn btn-success" onClick={handleClick("ValiderChauffeur")} > Valider </button>
                        <button className=" btn btn-danger" onClick={handleClick("RefuserChauffeur")} > Refuser </button>
                        
                    </>
                }
                subgroup = <>
                    <button className=" btn btn-primary" onClick={handleClick("ModifierChauffeur")} > Modifier </button>
                    {subgroup}
                </>
                if (modal) {
                    group = <>
                        {subgroup}
                        <button className=" btn btn-dark" onClick={handleClick("Annuler")}> Annuler </button>
                    </>
                }
                else {
                    group = subgroup;
                }
            }
        } else if (title === "commerciaux") {
            group = <>
                <button className=" btn btn-primary" onClick={handleClick("ModifierCommercial")} > Modifier </button>
                {

                    userModal.compte.access ?
                        <button className=" btn btn-danger" onClick={handleClick("SuspendreCommercial")} > Suspendre </button>
                        :
                        <button className=" btn btn-success" onClick={handleClick("AccesAuCommercial")} > Donner Accès </button>

                }
                <button className=" btn btn-dark" onClick={handleClick("Annuler")}> Annuler </button>
            </>
        }
        return group;
    }, [title, handleClick, userAuth, userModal, modal])

    const formUser = useMemo(() => {
        let errors = formState.errors
        if (userModal != null) {
            if (userModal instanceof Chauffeur) {
                console.log("generation from chauffeur");
                return <ContainerForm choiceUser="CHAUFFEUR" title="MODIFICATION" handleSubmit={handleSubmit(handleSubmitModal)}>
                    {
                        userModal.signInTextField({ register, errors, users: allUsersTable, setEnableQueryUsers: setEnableQueryAllUsersTable })
                    }
                    <div className=" text-center w-100" >
                        <Button variant="outlined" color="error" onClick={() => { $(".container-modal3").toggleClass("d-none"); reset() }} >Annuler</Button>
                    </div>
                </ContainerForm>
            } else if (userModal instanceof Commercial) {
                console.log("generation from commercial");
                return <ContainerForm choiceUser="COMMERCIAL" title="MODIFICATION" handleSubmit={handleSubmit(handleSubmitModal)}>
                    {
                        userModal.signInTextField({ register, errors, users: allUsersTable, setEnableQueryUsers: setEnableQueryAllUsersTable })
                    }
                    <div className=" text-center w-100" >
                        <Button variant="outlined" color="error" onClick={() => { $(".container-modal3").toggleClass("d-none"); reset() }} >Annuler</Button>
                    </div>
                </ContainerForm>
            }
        }
        return null
    }, [handleSubmit, handleSubmitModal, reset, register, formState, allUsersTable, userModal])

    const lineImages = useMemo(() => {
        let tab_tr = [];
        let k = 0
        for (let attr of includeURLImage) {

            if (attr !== "cni_recto" && attr !== "cni_verso") {

                if (Object.keys(userModal.compte).includes(attr)) {
                    tab_tr.push(
                        <tr key={("lineImagesCardFormUser"+attr+(++k))} >
                            <th className=" text-uppercase fw-bold" >{attr} </th>
                            <td>
                                <div className=" d-flex gap-2 justify-content-center" >
                                    <DisplayImage user={userModal} url={
                                        //@ts-ignore
                                        userModal.compte[attr] as string
                                        
                                        } name={attr} alt={attr} />
                                </div>
                            </td>

                        </tr>
                    )
                }
            }

        }
        return tab_tr;
    }, [ userModal])

    return (
        <div className=" bg-white rounded-3 shadow-lg" style={{ maxWidth:"95%" }}  >
            <ModalDashboard id="container-modal3">
                {formUser}
            </ModalDashboard>
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
                                <div className=" d-flex gap-2" >
                                    <DisplayImage user={user} url={user.compte.cni_recto as string} name="cni_recto" alt="cni_recto" />
                                    <DisplayImage user={user} url={user.compte.cni_verso as string} name="cni_verso" alt="cni_verso" />
                                </div>
                            </td>

                        </tr>
                        {
                            lineImages
                        }

                    </tbody>
                </table>
            </div>

            <div className="p-4 border-top border-2 border-dark">
                <div className=" d-flex gap-2 justify-content-end fs-6" >
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
