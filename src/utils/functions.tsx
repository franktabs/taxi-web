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

export function checkFileImg(file:File|FileList) {
    if(file instanceof FileList){
        file = file[0] as File;
    }
    
    if (file) {
        var fileSize = file.size; // Taille du fichier en octets
        var fileType = file.type; // Type MIME du fichier

        if (fileSize > 1024 * 1024) { // Vérifie si la taille du fichier est supérieure à 1 Mo
            return "doit être inférieur à 1Mo"
        } else if (fileType !== 'image/jpeg' && fileType !== 'image/png') { // Vérifie si le type du fichier est JPEG ou PNG
            return 'Veuillez sélectionner une image JPEG ou PNG.'
        } else {
            return true
        }
    } else {
        return 'Aucun fichier sélectionné.'
    }
}
