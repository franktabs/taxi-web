import { useEffect, useState, useCallback, useMemo, MouseEvent } from "react";
import { useModal } from "../../context/ModalProviderContext";
import CardFormUser from "../cards/user/CardFormUser";
import LigneTableUser from "../ligne/LigneTableUser";
import { AiOutlinePlus } from "react-icons/ai";
import $ from "jquery";
import { useUserAuth } from "../../context/UserAuthProviderContext";
import { Administrateur, Chauffeur, ChauffeurAttr, Commercial, CommercialAttr, Compte, CompteAttr, ModelAttr } from "../../Models";
import { Button } from "@mui/material";
import ContainerForm from "../../pages/autthentication/components/ContainerForm";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useFormState } from "react-hook-form/dist/useFormState";
import ModalDashboard from "../modal/ModalDashboard";
import { useQuery, useQueryClient } from "react-query";
import { KeyUseQuery } from "../../AllProvider";



type User = Compte


type Props = {
    title?: 'chauffeurs' | 'commerciaux',
}



export const excludeColumn: Array<keyof CompteAttr | keyof ChauffeurAttr> = ["position", "id", "administrateur_id", "commercial_id", "password", "cni_recto", "cni_verso"];

export type UserTableUser = User;
export type PropsTableUser = 'chauffeurs' | 'commerciaux';

const keyAllUsersTable: KeyUseQuery = "allUsersTable";
const keyUsersTable: KeyUseQuery = "usersTable";
export default function TableUser({ title = "chauffeurs" }: Props) {

    const queryClient = useQueryClient();

    const { setModal } = useModal();

    const { userAuth } = useUserAuth();

    const [allUsersTable, setAllUsersTable] = useState<Compte[] | null>(null);

    const [enableQueryAllUsersTable, setEnableQueryAllUsersTable] = useState(false);
    const [enableQueryUsersTable, setEnableQueryUsersTable] = useState(false);

    const instanceUser = useMemo(() => {
        var user = null
        if (title === "chauffeurs") {
            user = new Chauffeur(Chauffeur.clearDataChauffeur);
        } else if (title === "commerciaux") {
            user = new Commercial(Compte.dataClearCompte);
        }
        return user
    }, [title])

    const { handleSubmit, register, reset, formState } = useForm<ModelAttr>({ mode: "onSubmit" });

    const [usersTable, setUsersTable] = useState<Compte[] | null>(null);
    const [refresh, setRefresh] = useState({ val: false });

    useQuery([keyUsersTable], () => {
        if (userAuth.user instanceof Commercial) {
            let commercial = userAuth.user as Commercial;
            commercial.getChauffeurs().then((chauffeurs) => {
                setUsersTable(chauffeurs);
                console.log("liste des chauffeurs ", chauffeurs);
            });
        }
        if (userAuth.user instanceof Administrateur) {
            if(title==="chauffeurs"){
                Chauffeur.findAll().then((chauffeurs) => {
                    setUsersTable(chauffeurs);
                    console.log("liste des chauffeurs ", chauffeurs);
                });
            }else if(title==="commerciaux"){
                console.log("recherche commerciaux");
                Commercial.findAll().then((commerciaux) => {
                    setUsersTable(commerciaux);
                    console.log("liste des commerciaux ", commerciaux);
                });
            }
        }
        setEnableQueryUsersTable(false);
    }, { enabled: enableQueryUsersTable });

    useQuery([keyAllUsersTable], async () => {
        if(title==="chauffeurs"){
            let chauffeurs = await Chauffeur.findAll();
            setAllUsersTable(chauffeurs);
        }else if(title==="commerciaux"){
            let chauffeurs = await Commercial.findAll();
            setAllUsersTable(chauffeurs);
        }
        setEnableQueryAllUsersTable(false);
    }, { enabled: enableQueryAllUsersTable });


    // const [test, setTest] = useState<{val:boolean}>({val:false})

    useEffect(() => {
        console.log("title =>", title);
        let refreshTab = refresh;
        // if (title === "chauffeurs") {


            // let commercial = userAuth.user as Commercial;
            // commercial.getChauffeurs().then((chauffeurs) => {
            //     setUsersTable(chauffeurs);
            //     console.log("liste des chauffeurs ", chauffeurs);
            // });
            setEnableQueryUsersTable(true)

        // }
    }, [title, userAuth, refresh])

    const handleSubmitModal = useCallback(async (data: any) => {

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        // const formdata = new FormData(document.getElementById("formLogin") as HTMLFormElement);
        // const data = Object.fromEntries(formdata.entries())
        console.log("data du form", data);
        let instanceUser: Compte | null = null;
        let isEmpty = false;
        Object.values(data).forEach((val, key) => {
            if (!val) {
                isEmpty = true;
            }
        });

        if (isEmpty) {
            Toast.fire({
                icon: "error",
                title: 'Tous les champs sont obligatoire'
            })
            return
        }
        // event.preventDefault();
        console.log("title handleClick ", title);
        if (title === "chauffeurs") {
            if (userAuth.user instanceof Commercial) {
                instanceUser = await Chauffeur.saveFirebase({ dataForm: data, commercial_id: userAuth.user.compte.id });
            }
        }else if(title ==="commerciaux"){
            if(userAuth.user instanceof Administrateur){
                instanceUser = await Commercial.saveFirebase({ dataForm: data, administrateur_id: userAuth.user.compte.id });
            }
        }

        if (instanceUser != null) {

            queryClient.invalidateQueries([keyAllUsersTable]);
            queryClient.invalidateQueries([keyUsersTable]);
            setRefresh({ val: true })
            $(".container-modal2").toggleClass("d-none")
            setModal({ value: <div></div> })
            reset()
            Toast.fire({
                icon: "success",
                title: 'inscription réussi'
            })

        } else {
            console.log("inscription échoué");


            Toast.fire({
                icon: "error",
                title: 'Erreur inscription'
            })
        }
    }, [userAuth, title, setModal, queryClient, reset])




    // const afficheModal = useCallback(() => {

    //     var user: Compte | null = null;
    //     if (title === "chauffeurs") {
    //         user = new Chauffeur(Chauffeur.clearDataChauffeur);
    //     } else if (title === "commerciaux") {
    //         user = new Commercial(Commercial.dataClearCompte);
    //     }
    //     if (user) {
    //         return user;
    //     }
    //     return null
    // }, [title])

    const handleAjouter = useCallback(() => {
        let refreshTable = refresh;
        // var user :Compte|null = null;
        // if(title==="chauffeurs"){
        //     user = new Chauffeur(Chauffeur.clearDataChauffeur);
        // }else if(title==="commerciaux"){
        //     user = new Commercial(Compte.dataClearCompte);
        // }

        // if(user){
        //     let modal = $(".container-modal");
        //     modal.toggleClass("d-none");
        //     // setModal(<CardFormUser user={user} title={title} isNew={true} />)
        //     let modalForm = (
        //         <ContainerForm choiceUser="CHAUFFEUR" title="INSCRIPTION" handleSubmit={handleSubmit(handleSubmitModal)}>
        //             {
        //                 user.signInTextField({register, errors})
        //             }
        //             <div className=" text-center w-100" >
        //                 <Button variant="text" color="error" onClick={() => { $(".container-modal").toggleClass("d-none"); setModal({ value: <div></div> }); reset()}} >Annuler</Button>
        //             </div>
        //         </ContainerForm>
        //     )
        //     let value = {value:modalForm}
        //     setModal({ ...value});
        // }
        if (instanceUser) {
            let modal = $(".container-modal2");
            modal.toggleClass("d-none");
            setEnableQueryAllUsersTable(true)
        }

    }, [instanceUser, refresh])


    const ligneHead = useMemo(() => {
        let tableTH;
        if (usersTable) {
            let columnName = { ...usersTable[0]?.compte };
            excludeColumn.forEach((element) => {
                delete columnName[element as (keyof (typeof columnName))];
            })
            tableTH = Object.keys(columnName).map((value, key) => {

                return <th key={key + value + "ligneHead"} className=" text-uppercase" > {value} </th>
            })
        }
        return tableTH;
    }, [usersTable])


    const ligneBody = useMemo(() => {
        let tableTH;
        if (usersTable) {
            tableTH = usersTable.map((value, key) => {
                return (
                    <LigneTableUser user={value} key={"LigneBody" + value + key} title={title} setRefresh={setRefresh} />
                )
            })
        }
        return tableTH;
    }, [usersTable, title])

    const btnBeforeTable = useMemo(() => {
        if (title === "commerciaux") {
            return (
                <div>
                    <div>
                        <button onClick={handleAjouter} className="btn btn-primary d-flex justify-content-center align-items-center gap-1 fw-bolder"><AiOutlinePlus className=" fs-4" />Ajouter </button>
                    </div>
                    <hr />
                </div>
            )
        }
        else if (title === "chauffeurs") {
            if(userAuth instanceof Commercial){
                return (
                    <div>
                        <div>
                            <Button onClick={handleAjouter} variant="contained" className="d-flex bg-primary justify-content-center align-items-center gap-1 fw-bolder" ><AiOutlinePlus className=" fs-4" /> Ajouter</Button>
                        </div>
                        <hr />
                    </div>
                )
            }
            
        }


    }, [title, handleAjouter, userAuth]);


    const formUser = useMemo(() => {
        let errors = formState.errors
        if (instanceUser != null) {
            if (instanceUser instanceof Chauffeur) {
                console.log("generation from chauffeur");
                return <ContainerForm choiceUser="CHAUFFEUR" title="INSCRIPTION" handleSubmit={handleSubmit(handleSubmitModal)}>
                    {
                        instanceUser.signInTextField({ register, errors, users: allUsersTable, setEnableQueryUsers: setEnableQueryAllUsersTable })
                    }
                    <div className=" text-center w-100" >
                        <Button variant="outlined" color="error" onClick={() => { $(".container-modal2").toggleClass("d-none"); reset() }} >Annuler</Button>
                    </div>
                </ContainerForm>
            }else if(instanceUser instanceof Commercial){
                console.log("generation from commercial");
                return <ContainerForm choiceUser="COMMERCIAL" title="INSCRIPTION" handleSubmit={handleSubmit(handleSubmitModal)}>
                    {
                        instanceUser.signInTextField({ register, errors, users: allUsersTable, setEnableQueryUsers: setEnableQueryAllUsersTable })
                    }
                    <div className=" text-center w-100" >
                        <Button variant="outlined" color="error" onClick={() => { $(".container-modal2").toggleClass("d-none"); reset() }} >Annuler</Button>
                    </div>
                </ContainerForm>
            }
        }
        return null
    }, [instanceUser, handleSubmit, handleSubmitModal, reset, register, formState, allUsersTable])

    console.log("render TableUser");
    return (
        <div className=" bg-white p-3 shadow-lg" >
            <ModalDashboard id="container-modal2">
                {formUser}
            </ModalDashboard>

            <div style={{ transform: "translateY(-40px)" }} className={" py-3 text-center fw-bold rounded-4 " + (title === "chauffeurs" ? "bg-warning" : "bg-primary text-white")} >
                <p style={{ margin: 0 }} >
                    {title.toUpperCase()}
                    {/* <Button onClick={()=>{setTest({val:true})}} variant="contained" color="primary" >Refresh</Button> */}
                </p>
            </div>
            {
                btnBeforeTable
            }
            <div className=" table-responsive">
                <table className=" table table-hover px-2 table-bordered" >
                    <thead>
                        <tr>
                            <th className=" text-uppercase" >action</th>

                            {
                                ligneHead
                            }
                        </tr>

                    </thead>
                    <tbody>

                        {ligneBody}

                    </tbody>
                </table>
            </div>
        </div>
    )
}
