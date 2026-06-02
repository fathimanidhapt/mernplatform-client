import React from "react";
import Usernav from "../user/Usernav";

const Userlayout = ({ children }) => {
    return (
        <div>
            <Usernav />
            {children}
        </div>
    );
};

export default Userlayout;