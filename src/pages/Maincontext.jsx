import React, {
    createContext,
    useState,
} from "react";

import axios from "axios";
import { toast } from "react-toastify";


export const MainContext = createContext();

const API_USER =
    "http://localhost:3000/api/user/register";

const API_LOGIN =
    "http://localhost:3000/api/user/login";

const MainProvider = ({ children }) => {






    const signup = async (userData) => {
        try {

            const res = await axios.post(
                API_USER,
                userData
            );

            return res.data;

        } catch (error) {
            console.log(error);
            throw error;
        }
    };


    const Login = async (userData) => {
        try {

            const res = await axios.post(
                API_LOGIN,
                userData
            );

            return res.data;

        } catch (error) {
            console.log(error);
            throw error;
        }
    };




    return (
        <MainContext.Provider
            value={{


                signup,
                Login,


            }}
        >
            {children}
        </MainContext.Provider>
    );
};

export default MainProvider;