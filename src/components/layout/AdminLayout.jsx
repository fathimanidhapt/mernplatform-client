import React from "react";
import Adminnav from "../admin/Adminnav";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout-container">
            <Adminnav />
            <main className="admin-layout-main">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
