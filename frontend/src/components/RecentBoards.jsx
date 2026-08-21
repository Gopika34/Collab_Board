import { useEffect } from 'react'
import BoardCard from './BoardCard.jsx';

const RecentBoards = ({ boards,handleBoard }) => {

    if(boards.length===0){
        return (
            <div className='flex flex-col justify-center items-center py-20'>
                <p className='text-sm font-medium text-gray-800'>📋 No Boards Yet, Create your first board.</p>
            </div>
        )
    }
    return (
        <div className='w-full max-w-md'>
            <h3 className='font-bold text-lg pb-2'>Recent Boards:</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {
                    boards.map((board) => (
                        <BoardCard key={board._id} board={board} handleBoard={handleBoard} />
                    ))
                }
            </div>
        </div>
    )
}

export default RecentBoards
