import { FunctionComponent, MouseEvent, useCallback, useState } from "react";
import { BsFillPersonFill } from "react-icons/bs"
import { BsFillTaxiFrontFill } from "react-icons/bs"
import ForView from "../components/ForView";
import IconChauffeur from './../components/icons/chauffeurs/IconChauffeur';
import { styled } from "styled-components";
import CardUser from "../components/cards/user/CardUser";
import { PropsDataUser } from "../components/cards/user/CardUser";



type Props = {
    data?: {
        nbr?: number, //nombre
        nv?: number, //nouveau
        rfs?: number //refuser 
    },
    dates?: String[]
}


const initChauffeurs: PropsDataUser = {
    title: { nom: "Chauffeurs", className: "text-warning" },
    data: {
        nbr: 231,
        nv: 79,
        rfs: 3
    },
    dates: { date1: "Last 7 days", date2: "Last 30 days" },

}


const Dashboard: FunctionComponent = () => {

    const [dataCartChauffeur, setDataCartChauffeur] = useState<PropsDataUser>(initChauffeurs);



    const handleClick = useCallback((event: MouseEvent) => {
        console.log("object clicked");
    }, []);
    const handleClick2 = useCallback((event: MouseEvent) => {
        console.log("object clicked");
    }, []);


    return (
        <ForView>
            <div className=" d-flex flex-wrap gap-3" >

                <CardUser {...dataCartChauffeur} >
                    <IconChauffeur className=" translate-middle-y ms-2" />
                </CardUser>



            </div>

        </ForView>
    );
}

export default Dashboard;