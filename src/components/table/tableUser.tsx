import { useEffect, useState, useCallback } from "react";
import { useModal } from "../../context/ModalProviderContext";
import CardFormUser from "../cards/user/CardFormUser";
import LigneTableUser from "../ligne/LigneTableUser";
import { AiOutlinePlus } from "react-icons/ai";
import $ from "jquery";




type User = {
    nom: string|null,
    birthday?: string|null,
    sexe: string|null,
    profession?: string|null,
    pays?: string|null,
    type?: string|null
}


type Props = {
    title?: 'chauffeurs' | 'commerciaux',
}

export type UserTableUser = User;
export type PropsTableUser = 'chauffeurs' | 'commerciaux' ;

const initChauffeur:User[] = [
    {
        nom: "JEAN",
        birthday: "01/01/2023",
        sexe: "M",
        profession: "Informaticien",
        pays: "Ghana",
    },
    {
        nom: "Audrey",
        birthday: "01/01/2023",
        sexe: "M",
        profession: "Commuty Manager",
        pays: "Nigeria",
    },
    {
        nom: "Frank",
        birthday: "01/01/2023",
        sexe: "M",
        profession: "Enseignant",
        pays: "Cameroun",
    },
];

const initCommerciaux:User[] = [
    {
        nom: "ALLAIN",
        birthday: "01/02/2023",
        sexe: "M",
        profession: "Design Web",
        pays: "USA",
        type: "normal",
    },
    {
        nom: "JUDITH",
        birthday: "09/02/2019",
        sexe: "F",
        profession: "React Developer",
        pays: "Cameroun",
        type: "super",
    },
    {
        nom: "FRANK",
        birthday: "01/02/2023",
        sexe: "M",
        profession: "React Developer",
        pays: "Ghana",
        type: "normal",
    },
    {
        nom: "junior",
        birthday: "01/12/2023",
        sexe: "M",
        profession: "PHP Developer",
        pays: "Nigeria",
        type: "super",
    },
]

export default function TableUser({ title="chauffeurs" }: Props) {

    const { setModal} = useModal();

    const [usersTable, setUsersTable] = useState<User[]>(initChauffeur);
    
    useEffect(() => {
        console.log(title)
        if (title === "chauffeurs") {
            setUsersTable(initChauffeur);
        } else {
            setUsersTable(initCommerciaux)
        }
    }, [title])

    const handleAjouter = useCallback(() => {
        const user = {
            nom: null,
            birthday: null,
            sexe: null,
            profession: null,
            pays: null,
            type: null,
        }
        let modal = $(".container-modal");
        modal.toggleClass("d-none");
        setModal(<CardFormUser user={user} title={title} isNew={true} />);

    }, [title, setModal])

    
    return (
        <div className=" bg-white p-3" >

            <div style={{ transform: "translateY(-40px)" }} className={" py-3 text-center fw-bold rounded-4 " + (title === "chauffeurs" ? "bg-warning" : "bg-primary text-white")} >
                <p style={{ margin: 0 }} >
                    {title.toUpperCase()}
                </p>
            </div>
            {
                title === "commerciaux" ?
                    <div>
                        <div>
                            <button onClick={handleAjouter} className="btn btn-primary d-flex justify-content-center align-items-center gap-1 fw-bolder"><AiOutlinePlus className=" fs-4" />AJOUTER </button>
                        </div>
                        <hr />
                    </div>
                    : null
            }
            <table className=" table table-hover px-2" >
                <thead>
                    <tr>
                        {
                            Object.keys(usersTable[0]).map((value, key) => {
                                return <th key={key + value} className=" text-uppercase" > {value} </th>
                            })
                        }
                    </tr>

                </thead>
                <tbody>

                    {usersTable.map((value, key) => {
                        return (
                            <LigneTableUser user={value} key={"Ligne" + value + key} title={title} />
                        )
                    })}

                </tbody>
            </table>
        </div>
    )
}
