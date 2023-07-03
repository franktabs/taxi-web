import { FunctionComponent, useEffect, useCallback, MouseEvent } from "react";
import ForView from "../../components/ForView";
import { PropsDataUser } from "../../components/cards/user/CardUser";
import NavbarDashboard from '../../components/navbar/NavbarDashboard';
import { Outlet, useLoaderData, useNavigate } from "react-router";
import { useAppSelector } from "../../redux/hooks";
import { useUserAuth } from "../../context/UserAuthProviderContext";
import { BsFillPersonFill } from "react-icons/bs";
import { Compte } from "../../Models";
import { authentification } from "../../utils";
import { MdMenu } from "react-icons/md";
import $ from "jquery"

const Dashboard: FunctionComponent = () => {

    const { userAuth, setUserAuth } = useUserAuth();
    const navigate = useNavigate()

    useEffect(() => {
        let toggleMenu = document.querySelector(".toggle-menu");
        let subNav = $(".sub-nav");
        let body = document.body;
        body.addEventListener("click", (e) => {
            console.log("click body");
            if (subNav.hasClass("active")) {
                subNav.removeClass("active")
            }
        })

    }, [])

    const handleNav = useCallback((e: MouseEvent) => {
        e.stopPropagation();
        let subNav = $(".sub-nav");

        if (subNav.hasClass("active")) {
            subNav.removeClass("active")
        } else {
            subNav.addClass("active")
        }
    }, [])

    useEffect(() => {
        let userConnect = authentification();
        if (userAuth.user == null && userConnect != null) {
            setUserAuth({ user: userConnect })
        } else if (userConnect == null) {
            navigate("/login")
        }
    }, [ userAuth, setUserAuth, navigate]);

    console.log("userAuth=>", userAuth.user);

    return (
        <div >
            <div className=" bg-dark text-white d-flex  fs-4 p-2 mb-5 top-nav">
                <div className=" d-flex justify-content-center align-items-center gap-2">
                    <BsFillPersonFill /> {userAuth.user?.compte.nom.toUpperCase()}
                </div>
                <div className=" fs-1 toggle-menu" onClick={handleNav} ><MdMenu /></div>
            </div>
            <div className=" d-flex">
                <div className="content-nav" >
                    <div className="sub-nav" >
                        <NavbarDashboard />
                    </div>
                </div>
                <div className="next-content-nav" >
                    <Outlet />
                </div>
            </div>

        </div>

    );
}

export default Dashboard;