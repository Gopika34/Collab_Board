import {Navigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export const ProtectedRoutes=({children})=>{
    const {isLoggedIn} = useAuth();
    return (
        isLoggedIn ? 
            children
            :
            <Navigate to="/login" />
    )
}