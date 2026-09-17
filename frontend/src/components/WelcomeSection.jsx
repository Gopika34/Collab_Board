import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FaSquarePlus } from "react-icons/fa6";

const WelcomeSection = ({onOpen}) => {
    const { user } = useAuth();

    return (
        <section className="w-full rounded-3xl bg-surface border border-border p-8 shadow-lg relative overflow-hidden">
            {/* subtle accent glow, kept to one corner so violet stays an accent, not a wash */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-accent-soft blur-3xl opacity-40" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="space-y-3">
                    <h1 className="text-4xl font-bold text-text-primary">
                        Welcome Back,
                    </h1>
                    <h1 className="text-3xl font-bold text-accent">
                        {user?.userName || "Guest"} 👋
                    </h1>

                    <p className="max-w-lg text-text-secondary">
                        Manage your boards, organize your projects, and keep
                        track of your tasks in one place.
                    </p>
                </div>


                <button className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold
                    text-text-primary shadow-md transition-all duration-300
                    hover:bg-accent-hover hover:scale-105 active:scale-95"
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
