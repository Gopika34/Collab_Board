import { IoMdArrowDroprightCircle  } from "react-icons/io";

const BoardCard = ({board,handleBoard}) => {
    return (
        <div className='bg-slate-600/20 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 p-5 flex justify-between transition-all duration-300 cursor-pointer'>
            <button className='text-md font-medium' onClick={()=>handleBoard(board._id)}>{board.title}</button>
            {/* <h3 className='text-md font-medium'>{board.title}</h3>
            <button className="text-slate-800" ><IoMdArrowDroprightCircle  /></button> */}
        </div>
    )
}

export default BoardCard
