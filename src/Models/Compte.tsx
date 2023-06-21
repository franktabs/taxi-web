import { Box, FormControl, FormLabel, InputAdornment, TextField } from "@mui/material";
import { CompteAttr, ModelAttr, ParamsTextField } from "./type";
import RowRadioButtonsGroup from '../components/input/RowRadioButtonsGroup';
import { RegisterOptions } from "react-hook-form";
import { MdImage } from "react-icons/md";
import { checkFileImg } from "../utils";


export abstract class Compte {

    constructor(public compte: CompteAttr) {
        this.compte = compte;
    }

    static dataClearCompte: CompteAttr = { nom: "", email: "", password: "", quartier: "", date_naissance: "", tel: 237, sexe: "M", cni: "", pays: "Cameroun", expiration_cni: "", code: "", cni_recto: "", cni_verso: "", access: false, type: "", }


    signInTextField({ register, errors, users, setUsers }: ParamsTextField) {
        type TypeRegister = typeof register extends (name: infer T, options: infer P) => any ? P : never;
        console.log("errors =>", errors);
        let textField = [];
        let textFieldList: Array<keyof CompteAttr> = ["nom", "quartier", "cni"];
        let sameTypeNameList: Array<keyof CompteAttr> = ["email", "password"];
        let radioList: Array<keyof CompteAttr> = ["sexe"];
        let dateList: Array<keyof CompteAttr> = ["date_naissance", "expiration_cni"];
        let fileList: Array<keyof CompteAttr> = ["cni_recto", "cni_verso"];
        let numberList: Array<keyof CompteAttr> = ["tel"];
        let keyCompte = this.compte ? this.compte : [];
        textField = Object.keys(keyCompte).map((value2: any, index) => {

            var value = value2 as keyof ModelAttr
            var options: TypeRegister = { required: "Ce champs est requis" }

            if (textFieldList.includes(value)) {

                return (
                    <TextField error={errors[value] ? true : false} helperText={errors[value] && errors[value]?.message} label={value} key={index + value} {...register(value, options as any)} variant="filled" type='text' className=' w-100 text-capitalize' size="small" required />
                )
            } else if (fileList.includes(value)) {
                options.validate={
                    isValidFile:(val)=>{
                        if((val instanceof File)|| (val instanceof FileList)){
                            return checkFileImg(val)
                        }
                        
                    }
                }
                return <TextField error={errors[value] ? true : false} helperText={errors[value] && errors[value]?.message} label={value} key={index + value} {...register(value, options as any)} variant="outlined" sx={{ m: 1, width: '25ch' }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><MdImage className=" fs-3"/></InputAdornment>,
                    }} placeholder={value} title={value} type='file' className=' w-100 text-capitalize' required />
            }
            else if (radioList.includes(value)) {
                if (value === "sexe")
                    return <RowRadioButtonsGroup key={index + value} input={[{ label: "Masculin", value: "M" }, { label: "Feminin", value: "F" }]} title="Sexe" name={value} />
            }
            else if (dateList.includes(value)) {
                options.valueAsDate=true;
                return (
                    <FormControl key={value + index} className=" w-100">
                        <FormLabel className=" text-capitalize"> {value+"*"} </FormLabel>
                        <TextField key={index + value} error={errors[value] ? true : false} helperText={errors[value] && errors[value]?.message} {...register(value, options as any)} variant="standard" type="date" className=' w-100 text-capitalize' required />
                    </FormControl>
                )
            }
            else if (sameTypeNameList.includes(value)) {
                if (value === "password") {
                    options = { ...options, minLength: { value: 8, message: "Au moins 8 caractères" }}
                }if(value ==="email"){
                    options.validate={
                        errorSyntax:(val) =>{
                            let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if(regex.test(val as string)){
                                return true;
                            }
                            else{
                                return "Email invalide"
                            }
                        },
                        isExist:(val)=>{
                            if(users){
                                for(let user of users){
                                    val = val as string;
                                    if(user.compte.email.trim() === val.trim())
                                        return "Email existe déjà";
                                    else return true
                                }
                            }
                            return "Email non vérifié"
                        }
                    }
                }
                return <TextField error={errors[value] ? true : false} helperText={errors[value] && errors[value]?.message} label={value} key={index + value} {...register(value, options as any)} variant="filled" type={value} className=' w-100 text-capitalize' size="small" required />
            } else if (numberList.includes(value)) {
                if (value === "tel") {
                    options = { required:"Ce champs est requis",
                        valueAsNumber: true, validate: {
                            errorSyntax: (val ) => {
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
                        <TextField error={errors[value] ? true : false} {...register(value, options as any)} helperText={errors[value] && errors[value]?.message}  label={value} type={"number"} 
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