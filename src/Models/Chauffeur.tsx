import { CollectionReference, addDoc, collection, getDocs, Timestamp, Query } from "firebase/firestore";
import { Administrateur } from "./Administrateur";
import { Commercial } from "./Commercial";
import { Compte } from "./Compte";
import { ChauffeurAttr } from "./type";
import { db } from "../firebase";
import { codePromo, hashPassword } from "../utils";

// const emptyDataChauffeur: ChauffeurAttr = { online: false, position: { lat: 0, lng: 0 }, treated: false, nom: "", email: "", password: "", quartier: "", tel: 0, cni_recto: "", cni_verso: "", access: false, pays: "Cameroun", type:"", sexe:"M", cni:"" };
const collectChauffeur = collection(db, "chauffeur") as CollectionReference<ChauffeurAttr>;

export class Chauffeur extends Compte {

    commercial: Commercial | null;
    administrateur: Administrateur | null;

    static clearDataChauffeur:ChauffeurAttr = { ...super.dataClearCompte, online: false, position: { lat: 0, lng: 0 }, treated: false, permi_conduire: "", carte_grise: "", assurance: "", immatriculation: "", payer:false };
    static {
        this.dataClearCompte = this.clearDataChauffeur
    }

    constructor(public compte: ChauffeurAttr) {
        super(compte);
        this.commercial = null;
        this.administrateur = null;
        this.collection = collectChauffeur;
    }

    toDataFirebase(): ChauffeurAttr {
        const data = super.toDataFirebase() as ChauffeurAttr;
        data.online = this.compte.online;
        data.position = this.compte.position;
        data.treated = this.compte.treated;
        return data;
    }

    static async find(query: Query<ChauffeurAttr>): Promise<Chauffeur[]> {
        return getDocs(query).then((snapshot) => {
            const documents = snapshot.docs;
            return documents.map((value): Chauffeur => {
                let data = value.data();
                data.password = "";
                return new Chauffeur({ ...Chauffeur.clearDataChauffeur, ...data, id: value.id });
            })
        });
    }

    static  saveFirebase:(data:{dataForm:ChauffeurAttr|any, commercial_id?:string})=> Promise<Chauffeur|null> = async ({dataForm, commercial_id=""})=>{
        const dataForm2 = dataForm as ChauffeurAttr;
        dataForm2.date_naissance = Timestamp.fromDate(new Date(dataForm2.date_naissance as string));
        dataForm2.expiration_cni = Timestamp.fromDate(new Date(dataForm2.expiration_cni as string));
        const dataChauffeur: ChauffeurAttr = { ...Chauffeur.clearDataChauffeur, ...dataForm2 };
        dataChauffeur.created_at = Timestamp.fromDate(new Date());

        // var isSave = false;
        // let cni_verso = dataChauffeur.cni_verso as FileList;
        // let cni_recto = dataChauffeur.cni_recto as FileList;
        let password = dataChauffeur.password;
        dataChauffeur.password = hashPassword(password);
        // dataChauffeur.cni_recto = cni_recto["0"].name;
        // dataChauffeur.cni_verso = cni_verso["0"].name;
        console.log("object data", dataChauffeur);
        const chauffeur = new Chauffeur(dataChauffeur);
        let code = await codePromo(chauffeur);

        for (let key in dataChauffeur) {
            let k: keyof ChauffeurAttr = key as any;
            let fileImage = dataChauffeur[k];
            if (fileImage instanceof FileList) {
                if (code) {
                    await Compte.saveImage({ file: fileImage, name: k, code: code, user: chauffeur })
                }
            }
        }
        chauffeur.compte.commercial_id = commercial_id;
        console.log("avant sauvegarde=>", chauffeur);
        const sauvegarde = await addDoc(collectChauffeur, chauffeur.compte);
        if (sauvegarde.id) {
            console.log("cle id =>", sauvegarde.id);
            console.log("sauvegarde réussi");
            chauffeur.compte.id = sauvegarde.id;
            return chauffeur;
        }
        return null
    }


    static async findAll(): Promise<Chauffeur[]> {
        const collectionChauffeurs = collection(db, "chauffeur") as CollectionReference<ChauffeurAttr>
        
        return getDocs(collectionChauffeurs).then((snapshot) => {
            const documents = snapshot.docs;
            return documents.map((value): Chauffeur => {
                let data = value.data();
                data.password= "";
                return new Chauffeur({...Chauffeur.clearDataChauffeur,...data, id:value.id});
            })
        });
    }
}