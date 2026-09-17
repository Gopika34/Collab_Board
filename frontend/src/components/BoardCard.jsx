import { IoMdArrowDroprightCircle  } from "react-icons/io";

const BoardCard = ({board,handleBoard}) => {
    return (
        <div className='bg-surface border border-border rounded-xl shadow-md hover:shadow-xl hover:border-accent/50 hover:-translate-y-1 p-5 flex justify-between transition-all duration-300 cursor-pointer'>
            <button className='text-md font-medium text-text-primary' onClick={()=>handleBoard(board._id)}>{board.title}</button>
        </div>
    )
}

export default BoardCard
