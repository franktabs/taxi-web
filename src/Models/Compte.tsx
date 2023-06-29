import { Box, FilledInput, FormControl, FormLabel, InputAdornment, TextField } from "@mui/material";
import { ChauffeurAttr, CompteAttr, KeyModelAttr, ModelAttr, ParamsTextField, SaveImage } from "./type";
import RowRadioButtonsGroup from '../components/input/RowRadioButtonsGroup';
import { RegisterOptions } from "react-hook-form";
import { MdImage } from "react-icons/md";
import { checkFileImg } from "../utils";
import { CollectionReference } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import Swal from "sweetalert2";


export abstract class Compte {
    public collection: CollectionReference<CompteAttr | ChauffeurAttr> | null;
    constructor(public compte: CompteAttr) {
        this.compte = compte;
        this.collection = null;
    }

    static dataClearCompte: CompteAttr = { nom: "", email: "", password: "", quartier: "", date_naissance: "", tel: 237, sexe: "M", cni: "", pays: "Cameroun", expiration_cni: "", code: "", cni_recto: "", cni_verso: "", access: false, type: "", created_at: "", updated_at: "", photo: "" }


    static async saveImage({ file, name, code, user }: SaveImage) {
        if (file instanceof FileList) {
            let fichier = file.item(0);
            if (fichier) {
                var fichierRef = null;
                if (fichier.type === "image/png") {
                    fichierRef = ref(storage, "images/" + code + "/" + name + ".png");
                } else if (fichier.type === "image/jpeg") {
                    fichierRef = ref(storage, "images/" + code + "/" + name + ".jpeg");
                } else if (fichier.type === "image/jpg") {
                    fichierRef = ref(storage, "images/" + code + "/" + name + ".jpg");
                }
                if (fichierRef) {
                    try {
                        const uploadTask = await uploadBytes(fichierRef, fichier);
                        let url = await getDownloadURL(fichierRef);
                        //@ts-ignore
                        user.compte[name] = url;
                    } catch {
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
                        Toast.fire({
                            icon: "warning",
                            title: 'Un problème rencontré (Stockage de ' + name + ")"
                        })

                    }

                    // await uploadTask.on("state_changed",
                    //     (snapshot) => {
                    //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    //         console.log('Upload is ' + progress + '% done');
                    //         switch (snapshot.state) {
                    //             case 'paused':
                    //                 console.log('Upload is paused');
                    //                 break;
                    //             case 'running':
                    //                 console.log('Upload is running');
                    //                 break;
                    //         }
                    //     },
                    //     (error)=>{
                    //         const Toast = Swal.mixin({
                    //             toast: true,
                    //             position: 'top',
                    //             showConfirmButton: false,
                    //             timer: 3000,
                    //             timerProgressBar: true,
                    //             didOpen: (toast) => {
                    //                 toast.addEventListener('mouseenter', Swal.stopTimer)
                    //                 toast.addEventListener('mouseleave', Swal.resumeTimer)
                    //             }
                    //         })
                    //         switch (error.code) {
                    //             case 'storage/unauthorized':
                    //                 Toast.fire({
                    //                     icon: "warning",
                    //                     title: 'Non Authorisé (Stockage de '+name+")"
                    //                 })
                    //                 break;
                    //             case 'storage/canceled':
                    //                 Toast.fire({
                    //                     icon: "warning",
                    //                     title: 'Annulé (Stockage de ' + name + ")"
                    //                 })
                    //                 break;

                    //             // ...

                    //             case 'storage/unknown':
                    //                 Toast.fire({
                    //                     icon: "warning",
                    //                     title: 'Un problème rencontré (Stockage de ' + name + ")"
                    //                 })
                    //                 break;
                    //         }
                    //     },
                    //     ()=>{
                    //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    //             //@ts-ignore
                    //             user.compte[name] = downloadURL;
                    //             console.log("sauvegarde ", name,"reussi");
                    //         });
                    //     }
                    // )
                }
            }

        }

    }

    signInTextField({ register, errors, users, setEnableQueryUsers }: ParamsTextField) {
        type TypeRegister = typeof register extends (name: infer T, options: infer P) => any ? P : never;
        let textField = [];
        let textFieldList: Array<keyof ModelAttr> = ["nom", "quartier", "cni"];
        let sameTypeNameList: Array<keyof ModelAttr> = ["email", "password"];
        let radioList: Array<keyof ModelAttr> = ["sexe"];
        let dateList: Array<keyof ModelAttr> = ["date_naissance", "expiration_cni"];
        let fileList: Array<KeyModelAttr> = ["cni_recto", "cni_verso", "permi_conduire", "carte_grise", "assurance", "immatriculation"];
        let numberList: Array<keyof ModelAttr> = ["tel"];
        let keyCompte = this.compte ? this.compte : [];
        textField = Object.keys(keyCompte).map((value2: any, index) => {

            var value = value2 as keyof ModelAttr
            var options: TypeRegister = { required: "Ce champs est requis" }

            if (textFieldList.includes(value)) {
                if (value === "cni") {
                    options.minLength = { value: 6, message: "N° CNI invalide" }
                    options.pattern = {
                        value: /^[a-zA-Z0-9]+$/,
                        message: "N° CNI invalide"
                    }
                    options.validate = {
                        isExist: (val) => {
                            if (typeof val === "string") {
                                if (users) {
                                    let existe = false
                                    for (let user of users) {

                                        val = val as string;
                                        if (user.compte.cni?.trim() === val.trim()) {
                                            existe = true;
                                            break;
                                        }

                                    }
                                    return existe ? "N° CNI existe déjà" : true;
                                }
                                return "CNI non Verifié"
                            }
                        }
                    }
                }
                return (
                    <TextField error={errors[value] ? true : false} helperText={errors[value] && errors[value]?.message} label={value} key={index + value} {...register(value, options as any)} variant="filled" type='text' className=' w-100 text-capitalize' size="small" required />
                )
            } else if (fileList.includes(value)) {
                options.validate = {
                    isValidFile: (val) => {

                        if ((val instanceof File) || (val instanceof FileList)) {
                            return checkFileImg(val)
                        }

                    }
                }
                return <div >
                    <FormLabel className=" text-capitalize"> {value + "*"} </FormLabel>
                    <div className="input-group has-validation">
                        <span className="input-group-text" id="inputGroupPrepend"> <InputAdornment position="start"><MdImage className=" fs-3" /></InputAdornment> </span>
                        <input type="file" accept=".jpg, .jpeg, .png" capture={"environment"} {...register(value, options as any)} className={errors[value] ? "form-control is-invalid" : "form-control"} id={value} aria-describedby="inputGroupPrepend" required />
                        {
                            errors[value] ? <div className=" invalid-feedback text-capitalize">
                                {errors[value]?.message}
                            </div> : null
                        }
                    </div>
                </div>
                // <TextField error={errors[value] ? true : false} helperText={errors[value] && errors[value]?.message} label={value} key={index + value} {...register(value, options as any)} variant="outlined" sx={{ m: 1, width: '25ch' }}
                //     InputProps={{
                //         startAdornment: <InputAdornment position="start"><MdImage className=" fs-3" /></InputAdornment>,
                //         accept:"images/jpeg"
                //     }} placeholder={value} title={value} type='file' className=' w-100 text-capitalize' required />
            }
            else if (radioList.includes(value)) {
                if (value === "sexe")
                    return <RowRadioButtonsGroup key={index + value} input={[{ label: "Masculin", value: "M" }, { label: "Feminin", value: "F" }]} title="Sexe" name={value} register={register} />
            }
            else if (dateList.includes(value)) {
                options.valueAsDate = true;
                return (
                    <FormControl key={value + index} className=" w-100">
                        <FormLabel className=" text-capitalize"> {value + "*"} </FormLabel>
                        <TextField key={index + value} error={errors[value] ? true : false} helperText={errors[value] && errors[value]?.message} {...register(value, options as any)} variant="standard" type="date" className=' w-100 text-capitalize' required />
                    </FormControl>
                )
            }
            else if (sameTypeNameList.includes(value)) {
                if (value === "password") {
                    options = { ...options, minLength: { value: 8, message: "Au moins 8 caractères" } }
                } if (value === "email") {
                    options.validate = {
                        errorSyntax: (val) => {
                            let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (regex.test(val as string)) {
                                return true;
                            }
                            else {
                                return "Email invalide"
                            }
                        },
                        isExist: (val) => {
                            if (users) {
                                let existe = false;
                                for (let user of users) {
                                    val = val as string;
                                    if (user.compte.email.trim() === val.trim()) {
                                        existe = true;
                                        break;
                                    }

                                }
                                return existe ? "Email exist déjà" : true;
                            }
                            return "Email non vérifié"
                        }
                    }
                }
                return <TextField error={errors[value] ? true : false} helperText={errors[value] && errors[value]?.message} label={value} key={index + value} {...register(value, options as any)} variant="filled" type={value} className=' w-100 text-capitalize' size="small" required />
            } else if (numberList.includes(value)) {
                if (value === "tel") {
                    options = {
                        required: "Ce champs est requis",
                        valueAsNumber: true, validate: {
                            errorSyntax: (val) => {
                                let regex = /^6\d{8}$/;
                                if (regex.test(val as string)) {
                                    return true;
                                } else {
                                    return "Numero invalide";
                                }
                            }
                        }
                    }
                }
                return (
                    <Box key={value + index} sx={{ display: 'flex', alignItems: "flex-end", width: "100%" }}>
                        <TextField error={errors[value] ? true : false} {...register(value, options as any)} helperText={errors[value] && errors[value]?.message} label={value} type={"number"}
                            sx={{ m: 1, width: '25ch' }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">237</InputAdornment>,
                            }}
                            size="small"
                            variant="outlined" className=" w-100 ms-2 text-capitalize" />
                    </Box>
                )
            }
            return null
        })
        return textField;
    }

    toDataFirebase(): CompteAttr {
        return { ...this.compte }
    }

}