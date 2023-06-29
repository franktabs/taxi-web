import { Administrateur, Commercial, Compte, Chauffeur, ChauffeurAttr } from "../Models";
import { KeyUserLocalStorage } from "./type";
import bcrypt from "bcryptjs-react";
import { CollectionReference, addDoc, collection, getDocs, Timestamp, query, orderBy, limit, Query } from "firebase/firestore";


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

export function booleanString(value: any, valueTrue: string = "OUI", valueFalse: string = "NON") {
    if (typeof value == "boolean") {
        if (value) return valueTrue
        else return valueFalse
    }
    return value
}

export function checkFileImg(file: File | FileList) {
    if (file instanceof FileList) {
        file = file[0] as File;

    }

    if (file) {
        var fileSize = file.size; // Taille du fichier en octets
        var fileType = file.type; // Type MIME du fichier

        if (fileSize > 1024 * 1024) { // Vérifie si la taille du fichier est supérieure à 1 Mo
            return "doit être inférieur à 1Mo"
        } else if (fileType !== 'image/jpeg' && fileType !== 'image/png'&& fileType!== "image/jpg") { // Vérifie si le type du fichier est JPEG ou PNG
            return 'Veuillez sélectionner une image JPEG, JPG ou PNG.'
        } else {
            return true
        }
    } else {
        return 'Aucun fichier sélectionné.'
    }
}

export function hashPassword(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function checkPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash)
}

export async function codePromo(user: Commercial | Chauffeur): Promise<string|null> {
    if (user instanceof Commercial) {
        if (user.collection) {
            const q = query(user.collection, orderBy("code", "desc"), limit(1));
            const commercials = await Commercial.find(q);
            const commercial = commercials[0];
            let lastCode = commercial.compte.code
            if (lastCode) {
                let month = parseInt(lastCode.slice(4, 6));
                console.log("month", month)
                let nombre = parseInt(lastCode.slice(6));
                let actuelMonth = new Date().getMonth() + 1;
                console.log("actuel month", actuelMonth)
                let year = new Date().getFullYear().toString().slice(2);
                if (actuelMonth === month) {
                    nombre += 1;
                } else {
                    nombre = 1;
                }
                let code = "CO" + year + actuelMonth.toString().padStart(2, "0") + nombre.toString().padStart(2, "0");
                user.compte.code = code;
                return code;
            }
            else{
                let actuelMonth = new Date().getMonth() + 1;
                console.log("actuel month", actuelMonth)
                let year = new Date().getFullYear().toString().slice(2);
                let nombre = 1;
                let code = "CO" + year + actuelMonth.toString().padStart(2, "0") + nombre.toString().padStart(2, "0");
                user.compte.code = code;
                return code
            }

        }

    }
    else if (user instanceof Chauffeur){
        if(user.collection){
            const q1 = query(user.collection, orderBy("code", "desc"), limit(1));
            const q = q1 as Query<ChauffeurAttr>
            const chauffeurs = await Chauffeur.find(q);
            const chauffeur = chauffeurs[0];
            let code = genCode({lastUser:chauffeur, twoLetter:"CH"})
            user.compte.code  = code;
            return code
        }
    }
    return null
}

function genCode({lastUser, twoLetter}:{lastUser:Commercial|Chauffeur, twoLetter:string}){
    let lastCode = lastUser.compte.code
    if (lastCode) {
        let month = parseInt(lastCode.slice(4, 6));
        console.log("month", month)
        let nombre = parseInt(lastCode.slice(6));
        let actuelMonth = new Date().getMonth() + 1;
        console.log("actuel month", actuelMonth)
        let year = new Date().getFullYear().toString().slice(2);
        if (actuelMonth === month) {
            nombre += 1;
        } else {
            nombre = 1;
        }
        let code = twoLetter + year + actuelMonth.toString().padStart(2, "0") + nombre.toString().padStart(2, "0");
        // user.compte.code = code;
        return code;
    }
    else {
        let actuelMonth = new Date().getMonth() + 1;
        console.log("actuel month", actuelMonth)
        let year = new Date().getFullYear().toString().slice(2);
        let nombre = 1;
        let code = twoLetter + year + actuelMonth.toString().padStart(2, "0") + nombre.toString().padStart(2, "0");
        // user.compte.code = code;
        return code
    }
}

