import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MenuIcon from "@mui/icons-material/Menu";
import Star from '@mui/icons-material/Star';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const menuItem = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      path: "/banner-image",
      name: "Banner Image",
      icon: <ImageIcon />,
    },
    {
      path: "/projects",
      name: "Projects",
      icon: <WorkIcon />,
    },
    {
      path: "/valuable-clients",
      name: "Valuable Clients",
      icon: <PeopleIcon />,
    },
    {
      path: "/overview",
      name: "Overview",
      icon: <AssessmentIcon />,
    },
    {
      path: "/awards",
      name: "Awards & Certifications",
      icon: <Star />,
    },
    {
      path: "/testimonials",
      name: "Testimonials",
      icon: <FormatQuoteIcon />,
    },
    {
      path: "/gallery",
      name: "Gallery",
      icon: <PhotoLibraryIcon />,
    },
    {
      path: "/careers",
      name: "Careers",
      icon: <BusinessCenterIcon />,
    },
    {
      path: "/spotlights",
      name: "Spotlights",
      icon: <LightbulbIcon />,
    },
    {
      path: "/career-query",
      name: "Career Query",
      icon: <QueryBuilderIcon />,
    },
    {
      path: "/contact-query",
      name: "Contact Query",
      icon: <QueryBuilderIcon />,
    },
    
  ];
  return (
    <div>
      <div className="sidebar-side">
        <div style={{ width: isOpen ? "300px" : "50px" }} className="sidebar">
          <div className="top-section">
            <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
              <img className="logo-amb" src="icons/logo.png" alt="ambience"/>
            </h1>
            <div
              style={{ marginLeft: isOpen ? "50px" : "0px" }}
              className="bars"
            >
              <MenuIcon onClick={toggle} />
            </div>
          </div>
          {menuItem.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className="link"
              activeclassname="active"
            >
              <div className="icon">{item.icon}</div>
              <div className="icon">{item.name}</div>
            </NavLink>
          ))}
        <div className="w-auto log-out-btn">
            <button onClick={handleLogout}>
              {isOpen ? "Log Out" : <ExitToAppIcon />}
            </button>
          </div>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default Sidebar;
