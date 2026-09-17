import { FourSquare } from "react-loading-indicators";
import ListsContainer from '../components/ListsContainer';
import { BoardProvider, useBoard } from '../context/BoardContext';
import BoardHeader from "../components/BoardHeader";
import { useParams } from "react-router-dom";


const BoardPage = () => {

    const { id } = useParams();

    return (
        <BoardProvider boardId={id}>
            <BoardWorkspace />
        </BoardProvider>
    );
};


const BoardWorkspace = () => {

    const {
        board,
        lists,
        error,
        loading,
    } = useBoard();

    if (error) {
        return (
            <div className='w-full justify-center items-center p-4'>
                <p className='text-danger font-medium text-sm'>{error}</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className='fixed inset-0 bg-background/80 backdrop-blur-md flex flex-col justify-center items-center z-50 animate-fade-in'>
                <FourSquare color="#8b5cf6" size="small" text="" />
                <span className='text-sm font-semibold tracking-wide text-text-secondary uppercase mt-2 animate-pulse'>
                    Loading Data...
                </span>
            </div>
        )
    }

    return (
        <div className='w-full min-h-screen bg-background m-4 flex flex-col'>
            <BoardHeader board={board} />
            <ListsContainer/>
        </div>
    )
}

export default BoardPage
