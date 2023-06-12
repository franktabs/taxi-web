import { FunctionComponent, MouseEvent, useCallback, useState } from "react";
import { BsFillPersonFill } from "react-icons/bs"
import IconChauffeur from '../../components/icons/chauffeurs/IconChauffeur';
import CardUser from "../../components/cards/user/CardUser";
import { PropsDataUser } from "../../components/cards/user/CardUser";
import IconFloatUser from "../../components/icons/userSingle/IconFloatUser";
import { useModal } from "../../context/ModalProviderContext";
import ModalDashboard from "../../components/modal/ModalDashboard";
import TableUser, { PropsTableUser } from "../../components/table/TableUser";



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

abstract class TableViewUser {

    public renderView(title:PropsTableUser = "chauffeurs"):JSX.Element{
        return (
            <div className="mt-5" style={{ maxWidth: "800px" }}>
                <TableUser title={title} />
            </div> 
        )
    }
}

class ChauffeurTable extends TableViewUser{

    public renderView(title?: PropsTableUser): JSX.Element {
        return super.renderView();
    }
}

class CommercialTable extends TableViewUser{

    public renderView(title?: PropsTableUser): JSX.Element {
        return super.renderView("commerciaux");
    }
}

const Utilisateurs: FunctionComponent = () => {
    const { modal } = useModal();

    const [viewTable, setViewTable] = useState<TableViewUser | null>(null)


    const [dataCartChauffeur, setDataCartChauffeur] = useState<PropsDataUser>(initChauffeurs);

    const [dataCartCommercial, setDataCartCommercial] = useState<PropsDataUser>(initCommercial);


    const handleClick = useCallback((event: MouseEvent) => {
        setViewTable(new ChauffeurTable());
    }, []);
    const handleClick2 = useCallback((event: MouseEvent) => {
        setViewTable(new CommercialTable());
    }, []);


    return (
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
                viewTable?.renderView()
            }
        </div>
    );
}

export default Utilisateurs;