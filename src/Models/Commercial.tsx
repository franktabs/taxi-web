import { CollectionReference, collection, getDocs, query, where } from "firebase/firestore";
import { Administrateur } from "./Administrateur";
import { Chauffeur } from "./Chauffeur";
import { Compte } from "./Compte";
import { ChauffeurAttr, CommercialAttr } from "./type";
import { db } from "../firebase";


export class Commercial extends Compte {

    chauffeursList: Chauffeur[] | null;
    administrateur: Administrateur | null;

    constructor(public compte: CommercialAttr) {
        super(compte);
        this.chauffeursList = null;
        this.administrateur = null;
    }

    static async findAll(): Promise<Commercial[]> {
        const collectionCommercial = collection(db, "commercial") as CollectionReference<CommercialAttr>

        return getDocs(collectionCommercial).then((snapshot) => {
            const documents = snapshot.docs;
            return documents.map((value): Commercial => {
                let data = value.data();
                return new Commercial({...data, id:value.id});
            })
        });
    }

    static async login(data: any): Promise<Commercial | null> {
        const collectionCommercial = collection(db, "commercial") as CollectionReference<CommercialAttr>

        const queryCollection = query(collectionCommercial, where("email", "==", data.email));
        const dataDocs = await getDocs(queryCollection);
        var isExist = false;
        var commercial: Commercial | null = null;
        dataDocs.forEach((doc) => {
            let dataFirebase = doc.data();
            let password: string = data.password;
            if (dataFirebase.password === password.trim()) {
                isExist = true;
                commercial = new Commercial({ ...dataFirebase, id: doc.id});
            }
        })
        return commercial;
    }

    async getChauffeurs():Promise<Chauffeur[]|null> {
        const collectionChauffeur = collection(db, "chauffeur") as CollectionReference<ChauffeurAttr>

        const queryCollection = query(collectionChauffeur, where("commercial_id", "==", this.compte.id));
        const dataDocs = await getDocs(queryCollection);
        var isExist = false;
        var chauffeurs: Chauffeur[] | null = [];
        dataDocs.forEach((doc) => {
            let chauffeur = new Chauffeur({...Chauffeur.clearDataChauffeur ,...doc.data(), id: doc.id });
            chauffeurs?.push(chauffeur)
            console.log("docChauffeur inset=>", chauffeurs);
        });
        console.log("docChauffeur ouset=>", chauffeurs);
        return chauffeurs;
    }

}
