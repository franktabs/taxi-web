import { Timestamp } from "firebase/firestore";
import { UseFormRegister, FieldErrors, UseFormSetError } from "react-hook-form/dist/types";
import { Compte } from "./Compte";
import { Chauffeur } from "./Chauffeur";
import { Commercial } from './Commercial';
import { Administrateur } from "./Administrateur";

export type PositionType = {
    lat: number,
    lng: number,
}

export class Position {


    constructor(public position: PositionType) {
        this.position = position
    }
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
    photo?: string | File | FileList;
    pays: string;
    cni?: string;
    sexe?: "M" | "F";
    type?: string;
    expiration_cni?: Timestamp | string;
    date_naissance?: Timestamp | string;
    created_at?: Timestamp | string;
    updated_at?: Timestamp | string;

}

export interface ChauffeurAttr extends CompteAttr {
    online: boolean;
    position?: PositionType;
    treated: boolean;
    commercial_id?: string;
    administrateur_id?: string;
    permi_conduire?: string | File | FileList;
    carte_grise?: string | File | FileList;
    assurance?: string | File | FileList;
    immatriculation?: string | File | FileList;
    payer?:boolean
}

export interface CommercialAttr extends CompteAttr {
    administrateur_id?: string;
}

export type ModelAttr = ChauffeurAttr | CompteAttr | CommercialAttr

export type ParamsTextField = {
    register: UseFormRegister<ModelAttr>,
    errors: FieldErrors<ModelAttr>,
    setError?: UseFormSetError<ModelAttr>,
    users?: Compte[] | null;
    setEnableQueryUsers?: React.Dispatch<React.SetStateAction<boolean>>
}

type TypeOfObject<T extends (keyof K), K> = K[T] extends string? K[T] :never

export type SaveImage = {
    file: File | FileList,
    name: keyof CompteAttr | keyof ChauffeurAttr | keyof CommercialAttr,
    code: string,
    user: Compte
}


export type KeyModelAttr  = keyof CompteAttr | keyof ChauffeurAttr;