import { createContext,useContext,useEffect,useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext= createContext();

export const AuthProvider =({children})=>{
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) return null;
        try {
            return jwtDecode(storedToken);
        } catch (err) {
            localStorage.removeItem("token");
            return null;
        }
    });

    const login=(jwt) => {
        localStorage.setItem("token",jwt);
        setToken(jwt);

        const decodedUser = jwtDecode(jwt);
        setUser(decodedUser);

        return decodedUser;
    }
    
    const logout =() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }
    
    return(
        <AuthContext.Provider value={{
            token,
            user,
            login,
            logout,
            isLoggedIn: !!token
        }}>
            {children}
        </AuthContext.Provider>
    ) 
}

export const useAuth=() => {
    return useContext(AuthContext)
}
