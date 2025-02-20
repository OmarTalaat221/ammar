import React, { useState } from "react";
import { links } from "../../data/links";
import { NavLink } from "react-router-dom";
import "./style.css";
import { FaBars, FaSign } from "react-icons/fa";
import { logOut } from "../../utils/logout";

function SideNav() {
  const [open, setOpen] = useState(true);
  return (
    <div className={open ? "sidenav" : "sidenav active"}>
      <div className="sidenavlogo">
        <img
          style={{width:"50px" , height:"50px",borderRadius:"50%",objectFit:"contain"}}          
          src="https://res.cloudinary.com/dbz6ebekj/image/upload/v1731236553/logo_uz6xgq.png"
          alt=""
          className="logo"
          onClick={() => {
            window.location.href = "/";
          }}
        />
        <span
          onClick={() => {
            setOpen(!open);
          }}
          style={{ cursor: "pointer" }}
        >
          <FaBars />
        </span>
      </div>
      <ul className="sidenavlinks">
        {" "}
        {links?.map((item) => {
          if (!item?.hidden)
            return (
              <NavLink to={item?.route}>
                <span className="navicon">{item?.icon}</span>
                <span className="navlabel"> {item?.label}</span>
              </NavLink>
            );
        })}
      </ul>
      <div
        className="sidenavbottom"
        style={{ display: "flex", flexDirection: "column", gap: "5px" }}
      >
        {}
        <div className="logout btn btn-danger" onClick={()=>logOut()}>
          <span className="navlabel"> تسجيل خروج</span>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
