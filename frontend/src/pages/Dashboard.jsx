import { useEffect, useState } from 'react';
import { getBoards } from '../api/boards';
import Navbar from "../components/Navbar"
import WelcomeSection from '../components/WelcomeSection';
import RecentBoards from '../components/RecentBoards';
import CreateBoardModal from '../components/CreateBoardModal';
import { createBoard } from '../api/boards';
import { FourSquare } from "react-loading-indicators";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [boardInput, setBoardInput] = useState("");

    const navigate=useNavigate();

    const fetchBoards = async () => {
        setLoading(true);
        try {
            const res = await getBoards();
            setBoards(res.data);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch boards");
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    if (error) {
        return <p className='text-center text-red-400 text-md font-medium'>{error}</p>
    }

    if (loading) {
        return (
            <div className='fixed inset-0 bg-white/60 backdrop-blur-md flex flex-col justify-center items-center z-50 animate-fade-in'>
                {/* <div className='p-6 rounded-2xl bg-white/80 shadow-xl border border-slate-100 flex flex-col items-center justify-center gap-4'> */}
                <FourSquare color="#2563eb" size="small" text="" />
                <span className='text-sm font-semibold tracking-wide text-slate-600 uppercase mt-2 animate-pulse'>
                    Loading Data...
                </span>
                {/* </div> */}
            </div>
        )
    }

    const openModal = () => setShowModal(true);

    const closeModal = () => setShowModal(false);

    const handleCreateBoard = async () => {
        try {
            if (!boardInput.trim()) return;

            const res = await createBoard({ title: boardInput });
            setBoards(prevBoards => [...prevBoards, res.data]);

            setBoardInput("");
            setShowModal(false);
        }
        catch (err) {
            console.error("Failed to save board to database:", err);
            setError(err.response?.data?.message || "Failed to save board to database:")
        }
    }

    const handleBoard=(id)=>{
        console.log(id);
        navigate(`/board/${id}`);
    }

    return (
        <div className='min-h-screen bg-gray-100'>
            <Navbar />
            <div className="container mx-auto px-6 py-6">
                <WelcomeSection onOpen={openModal} />
            </div>
            <div className="container mx-auto px-6 py-6">
                <RecentBoards boards={boards} handleBoard={handleBoard} />
            </div>

            {showModal && <CreateBoardModal handleCreateBoard={handleCreateBoard} onClose={closeModal} boardInput={boardInput} setBoardInput={setBoardInput} />}
        </div>
    )
}

export default Dashboard
