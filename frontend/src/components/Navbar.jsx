import React from 'react'
import { FiLogOut } from "react-icons/fi";
import { useAuth } from '../context/AuthContext';
import {useNavigate} from "react-router-dom"

const Navbar = () => {
    const {logout}=useAuth();
    const navigate=useNavigate();

    const handleLogout=()=>{
        logout();
        navigate('/login');
    }

    return (
        <div className="bg-white shadow-sm border-b">
            <div className='flex justify-between items-center container mx-auto px-6 py-4'>
                <h1 className='text-2xl font-bold text-slate-800 '>CollabBoard</h1>
                <button className='rounded-lg px-5 py-2 flex items-center gap-1 active:scale-95
                    bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200'
                    onClick={handleLogout}
                >
                    <FiLogOut className="text-lg" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default Navbar
