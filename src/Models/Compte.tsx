import { TextField } from "@mui/material";
import { CompteAttr } from "./type";


export abstract class Compte {

    constructor(public compte: CompteAttr) {
        this.compte = compte;
    }

    static dataClearCompte: CompteAttr = { nom: "", email: "", password: "", quartier: "", tel: 237, sexe: "M", cni: "", pays: "Cameroun", cni_recto: "", cni_verso: "", access: false, type: "", }

    
    signInTextField() {
        let textField = [];
        let textFieldList: Array<keyof CompteAttr> = ["nom", "quartier","cni", "sexe"];
        let sameTypeNameList: Array<keyof CompteAttr> = ["email", "password"]
        let fileList: Array<keyof CompteAttr> = ["cni_recto", "cni_verso"];
        let numberList: Array<keyof CompteAttr> = ["tel"];
        let keyCompte = this.compte ? this.compte : [];
        textField = Object.keys(keyCompte).map((value: any, index) => {
            if (textFieldList.includes(value)) {
                return (
                    <TextField label={value} key={index + value} name={value} variant='outlined' type='text' className=' w-100 text-capitalize' size="small" required />
                )
            } else if (fileList.includes(value)) {
                return <TextField label={value} key={index + value} name={value} variant="standard" placeholder={value} title={value} type='file' className=' w-100 text-capitalize' size="small" required />
            }
            else if (sameTypeNameList.includes(value)) {
                return <TextField label={value} key={index + value} name={value} variant="outlined" type={value} className=' w-100 text-capitalize' size="small" required />
            } else if (numberList.includes(value)) {
                return <TextField label={value} key={index + value} name={value} variant="outlined" type="number" className=' w-100 text-capitalize' size="small" required />
            }
            return null
        })
        return textField;
    }

    toDataFirebase(): CompteAttr {
        return {
            nom: this.compte?.nom,
            email: this.compte?.email,
            quartier: this.compte?.quartier,
            tel: this.compte.tel as number,
            access: this.compte.access,
            password: this.compte.password,
            cni_recto: this.compte.cni_recto as string,
            cni_verso: this.compte.cni_verso as string,
            pays: this.compte.pays,
            sexe : this.compte.sexe
        }
    }

}