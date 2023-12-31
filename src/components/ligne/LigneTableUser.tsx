import { MouseEvent, useCallback, useMemo } from "react";
import { useModal } from "../../context/ModalProviderContext"
import CardFormUser from "../cards/user/CardFormUser";
import { excludeColumn, PropsTableUser, UserTableUser } from "../table/TableUser"
import { MdRemoveRedEye, MdLocationOn } from "react-icons/md"
import $ from "jquery";
import { styled } from "styled-components";
import { redirect, useNavigate } from "react-router";
import { booleanString } from "../../utils";
import { Timestamp } from "firebase/firestore";
import { history } from "../../App";
// import { useHistory } from "react-router";


type Props = {
    user: UserTableUser,
    title: PropsTableUser,
    setRefresh: React.Dispatch<React.SetStateAction<{ val: boolean }>>
}

const GroupBtnTd = styled.div`
    display: flex;
    gap: 2;
    width: max-content;
    color: white;
`

export default function LigneTableUser({ user, title, setRefresh }: Props) {

    const { setModal } = useModal();
    const navigate = useNavigate()
    // const history= useHistory()

    const handleClick = useCallback((e: MouseEvent) => {
        var classListButton = e.currentTarget.classList;
        console.log("voici le user du click", user)
        if (classListButton.contains("viewUser")) {
            let modal = $(".container-modal");
            modal.toggleClass("d-none");
            setModal(state => ({ ...state,  value: <CardFormUser user={user} title={title} setRefresh={setRefresh} />  }));
        } else if (classListButton.contains("viewCard")) {
            console.log("viewCard");
            // history.push("/dashboard/map", { user, title })
            
            let optionNavigate = { state: {userString:JSON.stringify(user), title}};
            navigate("/dashboard/map", optionNavigate )
            // history.forward();
            // redirect("/dashboard/map")
            // navigate("/dashboard/map", { state: { user, title } });
        }


    }, [user, title, setModal, setRefresh, navigate])

    const tuple = useMemo(()=>{
        let columnData = {...user.compte}
        excludeColumn.forEach((element) => {
            delete columnData[element as (keyof (typeof columnData))];
        })
        return Object.values(columnData).map((value2, key) => {

            let value: string|number="";
            if (value2 instanceof Timestamp) {
                value = value2.toDate().toLocaleDateString();
            }
            else if(typeof value2 ==="boolean"){
               value = booleanString(value2, "OUI", "NON") ;
            }
            else if (!(value2 instanceof File || value2 instanceof FileList )){value = value2 as string | number}
            if (user.compte.id) return <td key={user.compte.id + key}  > <div className=" w-maxContent" >{value}</div> </td>
        })
    },[user])

    return (
        <tr style={{ cursor: "pointer" }} className=" align-middle"  >
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

            {
                tuple
            }

        </tr>
    )
}
