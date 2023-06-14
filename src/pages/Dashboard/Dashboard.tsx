import { FunctionComponent } from "react";
import ForView from "../../components/ForView";
import { PropsDataUser } from "../../components/cards/user/CardUser";
import NavbarDashboard from '../../components/navbar/NavbarDashboard';
import { Outlet } from "react-router";



const Dashboard: FunctionComponent = () => {

    return (
        <ForView>
            <div >

                <div className=" position-fixed" style={{ left: "10px", top: "10px", bottom: "10px", width: "270px", minHeight: "400px", overflowY: "auto" }} >
                    <NavbarDashboard />

                </div>

                <div style={{ marginLeft: "270px" }}  >
                    <Outlet/>
                </div>

            </div>

        </ForView>
    );
}

export default Dashboard;