import { CollectionReference, collection, getDocs, query, where, Timestamp, addDoc, Query, orderBy } from "firebase/firestore";
import { Administrateur } from "./Administrateur";
import { Chauffeur } from "./Chauffeur";
import { Compte } from "./Compte";
import { ChauffeurAttr, CommercialAttr } from "./type";
import { db } from "../firebase";
import { codePromo, hashPassword } from "../utils";

const collectionCommercial = collection(db, "commercial") as CollectionReference<CommercialAttr>

export class Commercial extends Compte {

    chauffeursList: Chauffeur[] | null;
    administrateur: Administrateur | null;

    constructor(public compte: CommercialAttr) {
        super(compte);
        this.chauffeursList = null;
        this.administrateur = null;
        this.collection = collectionCommercial;
        
    }

    static async find(query: Query<CommercialAttr>): Promise<Commercial[]>{
        return getDocs(query).then((snapshot) => {
            const documents = snapshot.docs;
            return documents.map((value): Commercial => {
                let data = value.data();
                return new Commercial({ ...Commercial.dataClearCompte, ...data, id: value.id });
            })
        });
    }

    static async findAll(): Promise<Commercial[]> {

        return getDocs(collectionCommercial).then((snapshot) => {
            const documents = snapshot.docs;
            return documents.map((value): Commercial => {
                let data = value.data();
                return new Commercial({...Commercial.dataClearCompte,...data, id:value.id});
            })
        });


        // const collectionChauffeurs = collection(db, "chauffeur") as CollectionReference<ChauffeurAttr>
        // return getDocs(collectionChauffeurs).then((snapshot) => {
        //     const documents = snapshot.docs;
        //     return documents.map((value): Chauffeur => {
        //         let data = value.data();
        //         return new Chauffeur({ ...Chauffeur.clearDataChauffeur, ...data, id: value.id });
        //     })
        // });
    }

    static async login(data: any): Promise<Commercial | null> {

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
            // if (checkPassword(password.trim(), dataFirebase.password)) {
            //     isExist = true;
            //     commercial = new Commercial({ ...dataFirebase, id: doc.id });
            // }
        })
        return commercial;
    }

    async getChauffeurs():Promise<Chauffeur[]|null> {
        const collectionChauffeur = collection(db, "chauffeur") as CollectionReference<ChauffeurAttr>

        const queryCollection = query(collectionChauffeur, where("commercial_id", "==", this.compte.id), orderBy("created_at", "desc"));
        const dataDocs = await getDocs(queryCollection);
        var isExist = false;
        var chauffeurs: Chauffeur[] = [];
        dataDocs.forEach((doc) => {
            let chauffeur = new Chauffeur({...Chauffeur.clearDataChauffeur ,...doc.data(), id: doc.id });
            chauffeurs.push(chauffeur)
        });
        return chauffeurs;
    }

    static saveFirebase: (data: { dataForm: CommercialAttr | any, administrateur_id?: string }) => Promise<Commercial | null> = async ({ dataForm, administrateur_id = "" }) => {
        const dataForm2 = dataForm as CommercialAttr;
        dataForm2.date_naissance = Timestamp.fromDate(new Date(dataForm2.date_naissance as string));
        dataForm2.expiration_cni = Timestamp.fromDate(new Date(dataForm2.expiration_cni as string));
        const dataCommercial: CommercialAttr = { ...Commercial.dataClearCompte, ...dataForm2 };
        dataCommercial.created_at = Timestamp.fromDate(new Date());
        var isSave = false;
        let cni_verso = dataCommercial.cni_verso as FileList;
        let cni_recto = dataCommercial.cni_recto as FileList;
        let password = dataCommercial.password;
        dataCommercial.password = hashPassword(password);
        dataCommercial.cni_recto = "cni_recto";
        dataCommercial.cni_verso = "cni_verso";
        const commercial = new Commercial(dataCommercial);
        commercial.compte.administrateur_id = administrateur_id;
        await codePromo(commercial)
        console.log("avant sauvegarde=>", commercial);
        const sauvegarde = await addDoc(collectionCommercial, commercial.compte);
        if (sauvegarde.id) {
            console.log("cle id =>", sauvegarde.id);
            console.log("sauvegarde réussi");
            commercial.compte.id = sauvegarde.id;
            return commercial;
        }
        return null
    }

}
