import { Administrateur, Commercial } from "../Models";
import { KeyUserLocalStorage } from "./type"

export function authentification() {
    let keyUserAuth: KeyUserLocalStorage = "userAuth.commercial";
    let commercialString = localStorage.getItem(keyUserAuth);
    keyUserAuth = "userAuth.administrateur"
    let administrateurString = localStorage.getItem(keyUserAuth);
    let datareturn = null
    if (commercialString != null) {
        let commercialData = JSON.parse(commercialString) as Commercial;
        let commercial = new Commercial({ ...commercialData.compte });
        commercial.administrateur = commercialData.administrateur;
        commercial.chauffeursList = commercialData.chauffeursList;
        datareturn = commercial;
    } else if (administrateurString != null) {
        let administrateurData = JSON.parse(administrateurString) as Administrateur;
        let administrateur = new Administrateur({ ...administrateurData.compte });
        administrateur.chauffeursList = administrateurData.chauffeursList;
        administrateur.commercialsList = administrateurData.commercialsList;
        datareturn = administrateur;
    }
    return datareturn;
}

export function booleanString(value:any, valueTrue:string="OUI", valueFalse:string="NON" ){
    if(typeof value == "boolean"){
        if(value) return valueTrue
        else return valueFalse
    }
    return value
}