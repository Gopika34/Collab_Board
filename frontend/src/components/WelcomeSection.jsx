import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FaSquarePlus } from "react-icons/fa6";

const WelcomeSection = ({onOpen}) => {
    const { user } = useAuth();

    return (
        // <div className='w-full bg-slate-300 px-8 py-6 rounded-3xl shadow-md hover:shadow-xl'>
        //     <div className='mt-8 flex flex-col md:flex-row gap-3 justify-center '>
        //         <div className='flex flex-col gap-3 justify-center'>
        //             <h2 className='text-4xl font-bold text-gray-900'>{greetings}</h2>
        //             <p className='text-md font-normal text-gray-600'>Manage your boards, organize your projects, and keep track of your
        //     tasks in one place.</p>
        //         </div>
        //         <button className='rounded-lg p-4 flex items-center gap-1  border border-blue-800 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200'>
        //             <FaSquarePlus className="text-lg" />
        //             <span>Create Board</span>
        //         </button>
        //     </div>
        // </div>
        <section className="w-full rounded-3xl bg-gradient-to-r from-purple-300 to-rose-300 p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="space-y-3">
                    <h1 className="text-4xl font-bold text-white">
                        Welcome Back,
                    </h1>
                    <h1 className="text-3xl font-bold text-white">
                        {user?.userName || "Guest"} 👋
                    </h1>

                    <p className="max-w-lg text-white/90">
                        Manage your boards, organize your projects, and keep
                        track of your tasks in one place.
                    </p>
                </div>


                <button className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold
                    text-blue-600 shadow-md transition-all duration-300 
                    hover:scale-105 active:scale-95" 
                    onClick={onOpen}
                >
                    <FaSquarePlus className="text-lg" />
                    <span>Create Board</span>
                </button>

            </div>
        </section>
    )
}

export default WelcomeSection
