import {Navigate} from "react-router-dom";
import { useAuth } from "../context/authContext";

export const protectedRoutes=({children})=>{
    const isLoggedIn=useAuth();
    return (
        isLoggedIn ? 
            children
            :
            <Navigate to="/login" />
    )
}