import { FunctionComponent, MouseEvent, useCallback, useState } from "react";
import { BsFillPersonFill } from "react-icons/bs"
import ForView from "../components/ForView";
import IconChauffeur from './../components/icons/chauffeurs/IconChauffeur';
import CardUser from "../components/cards/user/CardUser";
import { PropsDataUser } from "../components/cards/user/CardUser";
import IconFloatUser from "../components/icons/userSingle/IconFloatUser";
import { useModal } from "../context/ModalProviderContext";
import ModalDashboard from "../components/modal/ModalDashboard";
import TableUser, { PropsTableUser } from "../components/table/TableUser";



const initChauffeurs: PropsDataUser = {
    title: { nom: "Chauffeurs", className: "text-warning" },
    data: {
        nbr: 231,
        nv: 79,
        rfs: 3
    },
    dates: { date1: "Last 7 days", date2: "Last 30 days" },

}

const initCommercial: PropsDataUser = {
    title: { nom: "Commerciaux", className: "text-success" },
    data: {
        nbr: 321,
        nv: 45,
        rfs: 6
    },
    dates: { date1: "Last 12 days", date2: "Last 13 days" },

}




const Dashboard: FunctionComponent = () => {
    const {modal} = useModal();

    const [viewTable, setViewTable] = useState<PropsTableUser|null>(null)

    
    const [dataCartChauffeur, setDataCartChauffeur] = useState<PropsDataUser>(initChauffeurs);

    const [dataCartCommercial, setDataCartCommercial] = useState<PropsDataUser>(initCommercial);


    const handleClick = useCallback((event: MouseEvent) => {
        setViewTable("chauffeurs");
    }, []);
    const handleClick2 = useCallback((event: MouseEvent) => {
        setViewTable("commerciaux")
    }, []);


    return (
        <ForView>
            <div className=" d-flex flex-wrap gap-3" >
                <ModalDashboard>
                    {modal}
                </ModalDashboard>

                <CardUser {...dataCartChauffeur} handleClick={handleClick} >
                    <IconChauffeur className=" translate-middle-y ms-2" />
                </CardUser>

                <CardUser {...dataCartCommercial} handleClick={handleClick2} >
                    <IconFloatUser className=" translate-middle-y ms-2" >
                        <BsFillPersonFill className=" fs-1" />
                    </IconFloatUser>
                </CardUser>

                {
                    viewTable != null ? (viewTable === "chauffeurs" ?
                        <div className="mt-5" style={{ maxWidth: "800px" }}>
                            <TableUser />
                        </div> :

                        <div className="mt-5" style={{ maxWidth: "800px" }} id="div-commerciaux">
                            <TableUser title="commerciaux" />
                        </div>) : null
                }

            </div>

        </ForView>
    );
}

export default Dashboard;