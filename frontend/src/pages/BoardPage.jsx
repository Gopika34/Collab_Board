import { FourSquare } from "react-loading-indicators";
import ListsContainer from '../components/ListsContainer';
import { useBoard } from '../context/BoardContext';
import BoardHeader from "../components/BoardHeader";

const BoardPage = () => {
    const {
        board,
        lists,
        error,
        loading,
        fetchListsByBoardId,
        fetchBoardById
    } = useBoard();

    if (error) {
        return (
            <div className='w-full justify-center items-center p-4'>
                <p className='text-red-500 font-medium text-sm'>{error}</p>
            </div>
        )
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

    return (
        <div className='w-full m-4 flex flex-col'>
            <BoardHeader board={board} />
            <ListsContainer lists={lists} />
        </div>
    )
}

export default BoardPage
