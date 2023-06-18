import { FunctionComponent, useEffect } from "react";
import ForView from "../../components/ForView";
import { PropsDataUser } from "../../components/cards/user/CardUser";
import NavbarDashboard from '../../components/navbar/NavbarDashboard';
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { useAppSelector } from "../../redux/hooks";
import { useUserAuth } from "../../context/UserAuthProviderContext";
import { BsFillPersonFill } from "react-icons/bs";
import { Compte } from "../../Models";
import { authentification } from "../../utils";



const Dashboard: FunctionComponent = () => {

    const { userAuth, setUserAuth } = useUserAuth();
    const loaderData = useLoaderData() as Compte;
    const navigate = useNavigate()

    useEffect(()=>{
        let userConnect = authentification();
        if(userAuth.user==null && userConnect!=null){
            setUserAuth({user:userConnect})
        }else if(userConnect==null){
            navigate("/login")
        }
    },[loaderData, userAuth, setUserAuth, navigate]);

    console.log("userAuth=>", userAuth.user);

    return (
        <div >
            <div className=" bg-light d-flex justify-content-end fs-4 p-2 mb-5">
                <div className=" d-flex justify-content-center align-items-center gap-2">
                    <BsFillPersonFill /> {userAuth.user?.compte.nom.toUpperCase()}
                </div>
            </div>
            <div className=" position-fixed" style={{ left: "10px", top: "10px", bottom: "10px", width: "270px", minHeight: "400px", overflowY: "auto" }} >
                <NavbarDashboard />
            </div>
            <div style={{ marginLeft: "300px" }}  >
                <Outlet />
            </div>

        </div>

    );
}

export default Dashboard;