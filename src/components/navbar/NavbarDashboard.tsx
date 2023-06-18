import styled from "styled-components";

import { MdDashboard, MdNotifications, MdOutlineLogout, MdLocationPin } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";

const ListNav = styled.ul`
  padding: 0;
  padding-top: 50px;
  & li {
    list-style: none;
    display: block;
  }

  & li a {
    display: block;
    padding: 10px;
    text-decoration: none;
    color: white;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 8px;
    width: 100%;
  }

  & li a.active {
    background-color: #0095ee;
  }

  & li a:hover:not(.active) {  
    background-color: gray;
  }`
;

export default function NavbarDashboard() {
  return (
      <div
          className="h-100 rounded-3 text-white p-2 "
          style={{ backgroundColor: "#3c3c43" }}
      >
          <div className=" fs-4 p-2 ">
              <Link className="text-decoration-none text-white" to={'/'}>Enterprise </Link>
          </div>
          <div>
              <ListNav>
                  <li>
                      <NavLink
                          className={({ isActive }) => {
                              return (
                                  " d-flex justify-content-start gap-2 fs-6 align-items-center " +
                                  (isActive ? "active" : "")
                              );
                          }}
                          to={"/dashboard/utilisateurs"}
                      >
                          <MdDashboard /> Utilisateurs
                      </NavLink>
                  </li>
                  <li>
                      <NavLink
                          className={({ isActive }) => {
                              return (
                                  " d-flex justify-content-start gap-2 fs-6 align-items-center " +
                                  (isActive ? "active" : "")
                              );
                          }}
                          to={"/dashboard/notifications"}
                      >
                          <MdNotifications /> Notifications
                      </NavLink>
                  </li>
                  <li>
                      <NavLink
                          className={({ isActive }) => {
                              return (
                                  " d-flex justify-content-start gap-2 fs-6 align-items-center " +
                                  (isActive ? "active" : "")
                              );
                          }}
                          to={"/dashboard/map"}
                      >
                          <MdLocationPin /> Carte
                      </NavLink>
                  </li>
                  <li className=" position-absolute bottom-0 d-flex justify-content-start gap-2 fs-5 fw-bold mb-3 align-items-center">
                      <Link to={"/login"} onClick={()=>localStorage.clear()} >
                          <MdOutlineLogout /> deconnecter
                      </Link>
                  </li>
              </ListNav>
          </div>
      </div>
  )
}
