import { Timestamp } from "firebase/firestore";



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
    cni_recto?: string | File;
    cni_verso?: string | File;
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


