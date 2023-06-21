import { Timestamp } from "firebase/firestore";
import { UseFormRegister, FieldErrors, UseFormSetError } from "react-hook-form/dist/types";
import { Compte } from "./Compte";



export type PositionType = {
    lat: number,
    lng: number,
}

export interface CompteAttr {
    id?: string;
    code?: string;
    nom: string;
    email: string;
    quartier?: string;
    tel?: number;
    access: boolean;
    password: string;
    cni_recto?: string | File | FileList;
    cni_verso?: string | File | FileList;
    pays: string;
    cni?: string;
    sexe?:"M"|"F";
    type?:string;
    expiration_cni?: Timestamp|string;
    date_naissance?:Timestamp|string;
}

export interface ChauffeurAttr extends CompteAttr {
    online: boolean;
    position?: PositionType;
    treated: boolean;
    commercial_id?: string;
    administrateur_id?: string;
}

export interface CommercialAttr extends CompteAttr {
    administrateur_id?: string;
}

export type ModelAttr = ChauffeurAttr | CompteAttr | CommercialAttr

export type ParamsTextField = {
    register:UseFormRegister<ModelAttr>,
    errors: FieldErrors<ModelAttr>,
    setError?: UseFormSetError<ModelAttr>,
    users?:Compte[]|null;
    setUsers?: React.Dispatch<React.SetStateAction<Compte[]|null>>
}

