import { MouseEvent, useCallback } from "react";
import { useModal } from "../../context/ModalProviderContext"
import CardFormUser from "../cards/user/CardFormUser";
import { PropsTableUser, UserTableUser } from "../table/TableUser"
import { MdRemoveRedEye, MdLocationOn } from "react-icons/md"
import $ from "jquery";
import { styled } from "styled-components";
import { useNavigate } from "react-router";



type Props = {
    user: UserTableUser,
    title: PropsTableUser
}

const GroupBtnTd = styled.div`
    display: flex;
    gap: 2;
    width: max-content;
    color: white;
`

export default function LigneTableUser({ user, title }: Props) {

    const {setModal} = useModal();
    const navigate = useNavigate()

    const handleClick = useCallback((e:MouseEvent) => {
        var classListButton = e.currentTarget.classList;

        if(classListButton.contains("viewUser")) {
            console.log("viewUser");
            let modal = $(".container-modal");
            modal.toggleClass("d-none");
            setModal(<CardFormUser user={user} title={title} />);
        }else if (classListButton.contains("viewCard")){
            console.log("viewCard");
            navigate("/dashboard/map", {state:{user, title}});
        }

        
    }, [user, title, setModal, navigate])

    return (
        <tr style={{ cursor: "pointer" }} className=" align-middle"  >

            {
                Object.values(user).map((value2, key) => {
                    let value = value2!=null?value2:"";
                    return <td key={key + value} > {value} </td>
                })
            }
            <td >
                <GroupBtnTd className=" d-flex gap-2" >
                    <button className="viewUser btn btn-success" onClick={handleClick}  ><MdRemoveRedEye className=" fs-5" /></button>
                    {
                        title === "chauffeurs" ? (
                            <button className="viewCard btn btn-primary" onClick={handleClick} ><MdLocationOn className=" fs-5" /></button>
                        ) : null
                    }
                </GroupBtnTd>
            </td>
        </tr>
    )
}
