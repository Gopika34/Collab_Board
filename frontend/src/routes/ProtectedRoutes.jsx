import {Navigate} from "react-router-dom";
import { useAuth } from "../context/authContext";

export const ProtectedRoutes=({children})=>{
    const {isLoggedIn} = useAuth();
    return (
        isLoggedIn ? 
            children
            :
            <Navigate to="/login" />
    )
}