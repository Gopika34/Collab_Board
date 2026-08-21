import { FiTrash2 } from "react-icons/fi";

const Card = ({ card, onDelete }) => {
    return (
        <div className='group bg-white rounded-lg shadow-sm px-3 py-2 border border-slate-200 cursor-pointer hover:bg-slate-50 flex justify-between items-start gap-2 transition-all duration-200'>
            <p className='text-sm text-slate-700 break-words'>{card.title}</p>
            <button
                className='text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity'
                onClick={() => onDelete(card._id)}
            >
                <FiTrash2 size={14} />
            </button>
        </div>
    )
}

export default Card
