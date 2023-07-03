


import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ForView from '../../components/ForView';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { CollectionReference, addDoc, getDocs } from "firebase/firestore";
import { db, storage } from '../../firebase';
import type { FirebaseApp } from 'firebase/app';
import { collection, doc, setDoc, getDoc, query, onSnapshot } from "firebase/firestore";
import { useCallback, MouseEvent } from 'react';
import { useActionData, useHref, useLocation, useNavigate, useNavigation } from "react-router";
import { Form, useFetcher } from "react-router-dom";
import { Administrateur, Chauffeur, ChauffeurAttr, Commercial, Compte } from "../../Models";
import ContainerForm from "./components/ContainerForm";
import IconChauffeur from "../../components/icons/chauffeurs/IconChauffeur";
import IconFloatUser from "../../components/icons/userSingle/IconFloatUser";
import { BsFillPersonFill } from "react-icons/bs";
import { toLogin } from "../../redux/userAuthSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useUserAuth } from "../../context/UserAuthProviderContext";
import Swal from "sweetalert2";
import { KeyUserLocalStorage } from "../../utils";
import $ from "jquery"


type ChoiceLogin = {
    user: "commercial" | "administrateur" | null,
    signIn: boolean,
}


function Login() {
    const [user, setUsers] = useState<Compte>(new Chauffeur(Chauffeur.clearDataChauffeur));
    useEffect(() => {
        console.log("login lancé");
    }, []);



    const navigate = useNavigate();

    const dispatch = useAppDispatch()

    const selector = useAppSelector(state => state.userAuth.user);

    const { setUserAuth } = useUserAuth();

    const [typeLogin, setTypeLogin] = useState<ChoiceLogin>({ user: null, signIn: false });


    const handleSubmitCommercial = useCallback(async (event: MouseEvent) => {
        event.preventDefault();
        const formdata = new FormData(document.getElementById("formLogin") as HTMLFormElement);
        const data = Object.fromEntries(formdata.entries())
        $(".loaderDualRing").attr("style", "display:flex");
        let instanceUser = await Commercial.login(data);
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

        if (instanceUser) {
            console.log("Connexion reussi");
            setUserAuth({ user: instanceUser });
            localStorage.clear();
            instanceUser.compte.password = "";
            let keyStorage: KeyUserLocalStorage = "userAuth.commercial";
            localStorage.setItem(keyStorage, JSON.stringify(instanceUser))

            navigate("/dashboard/utilisateurs")
            Toast.fire({
                icon: "success",
                title: 'Connexion réussi'
            })

        } else {
            console.log("Connexion échoué");


            Toast.fire({
                icon: "error",
                title: 'Echec Connexion'
            })
        }
        $(".loaderDualRing").attr("style", "display:none")
    }, [navigate, setUserAuth])

    const handleSubmitAdministrateur = useCallback(async (event: MouseEvent) => {
        event.preventDefault();
        const formdata = new FormData(document.getElementById("formLogin") as HTMLFormElement);
        const data = Object.fromEntries(formdata.entries())

        $(".loaderDualRing").attr("style", "display:flex")

        let instanceUser = await Administrateur.login(data);
        const Toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        if (instanceUser) {
            console.log("Connexion reussi");
            setUserAuth({ user: instanceUser });
            localStorage.clear();
            instanceUser.compte.password = "";
            let keyStorage: KeyUserLocalStorage = "userAuth.administrateur";
            localStorage.setItem(keyStorage, JSON.stringify(instanceUser))


            navigate("/dashboard/utilisateurs")


            Toast.fire({
                icon: "success",
                title: 'Connexion réussi'
            })

        } else {
            console.log("Connexion échoué");


            Toast.fire({
                icon: "error",
                title: 'Echec Connexion'
            })
        }
        $(".loaderDualRing").attr("style", "display:none");

    }, [navigate, setUserAuth]);

    const handleRedux = useCallback(() => {
        dispatch(toLogin({ user: new Chauffeur(Chauffeur.clearDataChauffeur) }))
    }, [dispatch])

    console.log("voici le selecteur", selector);

    return (

        <div className=" d-flex gap-5 justify-content-center flex-wrap px-2 px-sm-4 py-5">
            {
                typeLogin.user == null && typeLogin.signIn === false ? (
                    <>
                        <div className="monstyle bg-white rounded-2 shadow-lg d-flex flex-column align-items-center p-3" >
                            <div >
                                <IconChauffeur className=" translate-middle position-absolute" />
                            </div>
                            <div className=" mt-5"  >
                                <h3 className=" text-warning fw-bolder fs-1" style={{ marginTop: "-12px" }} >CHAUFFEUR </h3>
                            </div>
                            <div className=" mt-2">
                                <Button variant="contained" color="success" className=" fw-bold" onClick={() => setTypeLogin({ user: null, signIn: true })} >S'inscrire</Button>
                            </div>

                        </div>
                        <div className="monstyle bg-white rounded-2 shadow-lg d-flex flex-column align-items-center p-3" >
                            <div >
                                <IconFloatUser className=" translate-middle position-absolute" >
                                    <BsFillPersonFill className=" fs-1" />
                                </IconFloatUser>
                            </div>
                            <div className=" mt-5"  >
                                <h3 className=" text-primary fw-bolder fs-1" style={{ marginTop: "-12px" }} >COMMERCIAL </h3>
                            </div>
                            <div className=" mt-2">
                                <Button variant="contained" color="success" className=" fw-bold" onClick={() => setTypeLogin({ user: "commercial", signIn: false })} >Se connecter</Button>
                            </div>
                        </div>


                        <div className="monstyle bg-white rounded-2 shadow-lg d-flex flex-column align-items-center p-3" >
                            <div >
                                <IconFloatUser className=" translate-middle position-absolute" >
                                    <BsFillPersonFill className=" fs-1" />
                                </IconFloatUser>
                            </div>
                            <div className=" mt-5"  >
                                <h3 className=" text-danger fw-bolder fs-1" style={{ marginTop: "-12px" }} >ADMINISTRATEUR </h3>
                            </div>
                            <div className=" mt-2">
                                <Button variant="contained" color="success" className=" fw-bold" onClick={() => setTypeLogin({ user: "administrateur", signIn: false })} >Se connecter</Button>
                            </div>

                        </div>

                    </>
                ) : (typeLogin.user === "commercial" ?
                    <ContainerForm choiceUser="COMMERCIAL" handleSubmit={handleSubmitCommercial}>
                        <TextField label="Email" name="email" variant="standard" type='email' className=' w-100 text-capitalize' required />
                        <TextField label="Password" name="password" variant="standard" type='password' className=' w-100 text-capitalize' required />
                        <div className=" text-center">
                            <span>Se Connecter en tant que</span>
                            <Button variant="text" onClick={() => setTypeLogin({ user: "administrateur", signIn: false })} >Administrateur</Button>
                            <Button variant="text" color="error" onClick={() => setTypeLogin({ user: null, signIn: false })} >Annuler</Button>

                        </div>
                    </ContainerForm> : (
                        typeLogin.user === "administrateur" ?
                            <ContainerForm choiceUser="ADMINISTRATEUR " handleSubmit={handleSubmitAdministrateur}>
                                <TextField label="Email" name="email" variant="standard" type='email' className=' w-100 text-capitalize' size="small" required />
                                <TextField label="Password" name="password" variant="standard" type='password' className=' w-100 text-capitalize' size="small" required />
                                <div className=" text-center">
                                    <span>Se Connecter en tant que</span>
                                    <Button variant="text" onClick={() => setTypeLogin({ user: "commercial", signIn: false })} >Commercial</Button>
                                    <Button variant="text" color="error" onClick={() => setTypeLogin({ user: null, signIn: false })} >Annuler</Button>

                                </div>
                            </ContainerForm> :
                            <ContainerForm choiceUser="CHAUFFEUR" title="INSCRIPTION" handleSubmit={handleSubmitAdministrateur}>
                                {
                                    // user.signInTextField()
                                }
                                <Button variant="text" color="error" onClick={() => setTypeLogin({ user: null, signIn: false })} >Annuler</Button>

                            </ContainerForm>
                    )
                )
            }
        </div>


    )
}

export default Login