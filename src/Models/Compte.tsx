import { Box, FormControl, FormLabel, TextField } from "@mui/material";
import { CompteAttr } from "./type";
import RowRadioButtonsGroup from '../components/input/RowRadioButtonsGroup';


export abstract class Compte {

    constructor(public compte: CompteAttr) {
        this.compte = compte;
    }

    static dataClearCompte: CompteAttr = { nom: "", email: "", password: "", quartier: "", date_naissance: undefined, tel: 237, sexe: "M", cni: "", pays: "Cameroun", expiration_cni: undefined,code:"", cni_recto: "", cni_verso: "", access: false, type: "", }

    
    signInTextField() {
        let textField = [];
        let textFieldList: Array<keyof CompteAttr> = ["nom", "quartier","cni"];
        let sameTypeNameList: Array<keyof CompteAttr> = ["email", "password"];
        let radioList: Array<keyof CompteAttr> = ["sexe"];
        let dateList: Array<keyof CompteAttr>  = ["date_naissance", "expiration_cni"];
        let fileList: Array<keyof CompteAttr> = ["cni_recto", "cni_verso"];
        let numberList: Array<keyof CompteAttr> = ["tel"];
        let keyCompte = this.compte ? this.compte : [];
        textField = Object.keys(keyCompte).map((value: any, index) => {
            if (textFieldList.includes(value)) {
                return (
                    <TextField label={value} key={index + value} name={value} variant="filled" type='text' className=' w-100 text-capitalize' size="small" required />
                )
            } else if (fileList.includes(value)) {
                return <TextField label={value} key={index + value} name={value} variant="standard" placeholder={value} title={value} type='file' className=' w-100 text-capitalize' size="small" required />
            }
            else if(radioList.includes(value)){
                if(value==="sexe") 
                    return <RowRadioButtonsGroup key={index+value} input={[{ label: "Masculin", value: "M" }, { label: "Feminin", value: "F" }]} title="Sexe" name={value} />
            }
            else if(dateList.includes(value)){
                return (
                    <FormControl key={value+index}  className=" w-100">
                        <FormLabel className=" text-capitalize"> {value} </FormLabel>
                        <TextField key={index + value} name={value} variant="standard" type="date" className=' w-100 text-capitalize' required />
                    </FormControl>
                )
            }
            else if (sameTypeNameList.includes(value)) {
                return <TextField label={value} key={index + value} name={value} variant="filled" type={value} className=' w-100 text-capitalize' size="small" required />
            } else if (numberList.includes(value)) {
                return(
                    <Box key={value+index} sx={{ display: 'flex', alignItems: "flex-end", width:"100%"}}>
                        <FormLabel className=" text-capitalize"> +237 </FormLabel>
                        <TextField id="input-with-sx" label={value} variant="standard" type={"number"} className=" w-100 ms-2 text-capitalize" />
                    </Box>
                )
            }
            return null
        })
        return textField;
    }

    toDataFirebase(): CompteAttr {
        return {...this.compte}
    }

}