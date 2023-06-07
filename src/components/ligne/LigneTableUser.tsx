import { useCallback } from "react";
import { useModal } from "../../context/ModalProviderContext"
import CardFormUser from "../cards/user/CardFormUser";
import { PropsTableUser, UserTableUser } from "../table/TableUser"
import $ from "jquery";



type Props = {
    user: UserTableUser,
    title: PropsTableUser
}

export default function LigneTableUser({ user, title }: Props) {

    const {modal, setModal} = useModal();

    const handleClick = useCallback(() => {
        let modal = $(".container-modal");
        modal.toggleClass("d-none");
        setModal(<CardFormUser user={user} title={title} />);
    }, [user, title])

    return (
        <tr style={{ cursor: "pointer" }} onClick={handleClick}  >

            {
                Object.values(user).map((value2, key) => {
                    let value = value2!=null?value2:"";
                    return <td key={key + value} > {value} </td>
                })
            }
        </tr>
    )
}
