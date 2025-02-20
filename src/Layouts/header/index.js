import React, { useState } from "react";
import "./style.css";
import { logOut } from "../../utils/logout";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  

  return (
    <header className="header">
      <div className="profile-container">
        <div className="profile-info" onClick={toggleDropdown}>
          <img
            src="https://res.cloudinary.com/dbz6ebekj/image/upload/v1731236553/logo_uz6xgq.png"
            style={{ width: "40px" }}
            alt="Profile"
            className="profile-image"
          />
          <span className="profile-name">عمار</span>
          <i className="arrow-down"></i>
        </div>
        {dropdownOpen && (
          <ul className="dropdown-menu" style={{display:"flex",flexDirection:"column",gap:"5px"}}>
            {/* <li>Profile</li>
            <li>Settings</li> */}
            <li onClick={()=>logOut()}>تسجيل خروج</li>
          </ul>
        )}
      </div>

      <div className="search-container">
        <input type="text" placeholder="بحث..." className="search-input" />
      </div>
    </header>
  );
}

export default Header;
