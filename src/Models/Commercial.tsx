import { CollectionReference, collection, getDocs, query, where, Timestamp, addDoc, Query, orderBy } from "firebase/firestore";
import { Administrateur } from "./Administrateur";
import { Chauffeur } from "./Chauffeur";
import { Compte } from "./Compte";
import { ChauffeurAttr, CommercialAttr } from "./type";
import { db, storage } from "../firebase";
import { checkPassword, codePromo, hashPassword } from "../utils";
import { ref, uploadBytes, } from "firebase/storage";

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
                data.password="";
                return new Commercial({ ...Commercial.dataClearCompte, ...data, id: value.id });
            })
        });
    }

    static async findAll(): Promise<Commercial[]> {

        return getDocs(collectionCommercial).then((snapshot) => {
            const documents = snapshot.docs;
            return documents.map((value): Commercial => {
                let data = value.data();
                data.password = "";
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
            
            // if (dataFirebase.password === password.trim()) {
            //     isExist = true;
            //     commercial = new Commercial({ ...dataFirebase, id: doc.id});
            //     commercial.compte.password=""
            // }
            if (checkPassword(password.trim(), dataFirebase.password)) {
                isExist = true;
                commercial = new Commercial({ ...dataFirebase, id: doc.id });
            }
        })
        
        return commercial;
    }

    async getChauffeurs():Promise<Chauffeur[]|null> {
        const collectionChauffeur = collection(db, "chauffeur") as CollectionReference<ChauffeurAttr>
        console.log("nouveau chauffers getchauffeur");
        const queryCollection = query(collectionChauffeur, where("commercial_id", "==", this.compte.id));
        const dataDocs = await getDocs(queryCollection);
        var isExist = false;
        var chauffeurs: Chauffeur[] = [];
        dataDocs.forEach((doc) => {
            let data = doc.data();
            data.password=""
            let chauffeur = new Chauffeur({...Chauffeur.clearDataChauffeur ,...data, id: doc.id });
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
        // var isSave = false;
        // let cni_verso = dataCommercial.cni_verso as FileList;
        // let cni_recto = dataCommercial.cni_recto as FileList;
        let password = dataCommercial.password;
        dataCommercial.password = hashPassword(password);

        const commercial = new Commercial(dataCommercial);
        commercial.compte.administrateur_id = administrateur_id;
        let code = await codePromo(commercial);

        for(let key in dataCommercial){
            let k:keyof CommercialAttr = key as any;
            let fileImage = dataCommercial[k];
            if(fileImage instanceof FileList){
                if(code){
                    await Compte.saveImage({ file: fileImage, name: k, code: code, user: commercial })
                }
            }
        }
        // var cni_rectoRef = null;
        // var cni_versoRef = null;
        // if(cni_recto[0].type==="image/png"){
        //     cni_rectoRef = ref(storage, "images/"+code+"/cni_recto.png");
        // } else if (cni_recto[0].type === "image/jpeg"){
        //     cni_rectoRef = ref(storage, "images/" + code + "/cni_recto.jpeg");
        // } else if (cni_recto[0].type === "image/jpg") {
        //     cni_rectoRef = ref(storage, "images/" + code + "/cni_recto.jpg");
        // }
        // console.log("cni_verso", cni_verso);
        // console.log("cni_recto", cni_recto);


        // if (cni_verso[0].type === "image/png") {
        //     cni_versoRef = ref(storage, "images/" + code + "/cni_verso.png");
        // } else if (cni_verso[0].type === "image/jpeg") {
        //     cni_versoRef = ref(storage, "images/" + code + "/cni_verso.jpeg");
        // } else if (cni_verso[0].type === "image/jpg") {
        //     cni_versoRef = ref(storage, "images/" + code + "/cni_verso.jpg");
        // }
        // if(cni_rectoRef && cni_versoRef){
        //     uploadBytes(cni_rectoRef, cni_recto[0]).then((snapshot) => {
        //         console.log("telechargement cni_recto termniné")
        //     })
        //     uploadBytes(cni_versoRef, cni_verso[0]).then((snapshot) => {
        //         console.log("telechargement cni_verso termniné")
        //     })
        // }

        console.log("avant sauvegarde=>", commercial);
        const sauvegarde = await addDoc(collectionCommercial, commercial.compte);
        if (sauvegarde.id) {
            console.log("cle id =>", sauvegarde.id);
            console.log("sauvegarde réussi");
            commercial.compte.id = sauvegarde.id;
            commercial.compte.password=""
            return commercial;
        }
        return null
    }

}
