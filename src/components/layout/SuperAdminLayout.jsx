import React from "react";
import Supernav from "../superadmin/Supernav";
import "./SuperAdminLayout.css";

const SuperAdminLayout = ({ children }) => {
    return (
        <div className="super-layout-container">
            <Supernav />
            <main className="super-layout-main">
                {children}
            </main>
        </div>
    );
};

export default SuperAdminLayout;
