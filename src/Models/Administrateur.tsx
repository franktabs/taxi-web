import { CollectionReference, collection, getDocs, query, where } from "firebase/firestore";
import { Chauffeur } from "./Chauffeur";
import { Commercial } from "./Commercial";
import { Compte } from "./Compte";
import { CompteAttr } from "./type";
import { db } from "../firebase";


export class Administrateur extends Compte {
    chauffeursList: Chauffeur[] | null;
    commercialsList: Commercial[] | null;

    constructor(public compte: CompteAttr) {
        super(compte);
        this.chauffeursList = null;
        this.commercialsList = null;
    }

    static async findAll(): Promise<Administrateur[]> {
        const collectionAdministrateur = collection(db, "administrateur") as CollectionReference<CompteAttr>

        return getDocs(collectionAdministrateur).then((snapshot) => {
            const documents = snapshot.docs;
            return documents.map((value): Administrateur => {
                let data = value.data();
                return new Administrateur({...data, id:value.id});
            })
        });
    }

    static async login(data: any): Promise<Administrateur | null> {
        const collectionAdministrateur = collection(db, "administrateur") as CollectionReference<CompteAttr>

        const queryCollection = query(collectionAdministrateur, where("email", "==", data.email));
        const dataDocs = await getDocs(queryCollection);
        var isExist = false;
        var administrateur: Administrateur | null = null;
        dataDocs.forEach((doc) => {
            let dataFirebase = doc.data();
            let password: string = data.password;
            if (dataFirebase.password === password.trim()) {
                isExist = true;
                administrateur = new Administrateur({ ...dataFirebase, id:doc.id });
            }
        })
        return administrateur;
    }
}
