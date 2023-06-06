import { useEffect, useState } from "react";


type User = {
    nom: string,
    birthday?: string,
    sexe: string,
    profession?: string,
    pays?: string,
    type?: string
}

type Props = {
    title: 'chauffeurs' | 'commerciaux',
    users: User[]
}

export default function tableUser({ title, users }: Props) {

    const [usersTable, setUsersTable] = useState<User[]>(users);
    
    useEffect(() => {
        console.log(title)
        if (title === "chauffeurs") {
            setUsersTable(users);
        } else {
            setUsersTable(commerciaux)
        }
    }, [title])

    
    return (
        <div className=" bg-white p-3" >

        </div>
    )
}
