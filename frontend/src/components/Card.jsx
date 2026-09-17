import { FiTrash2 } from "react-icons/fi";

const Card = ({ card, onDelete,listId }) => {
    return (
        <div className='group bg-surface-elevated rounded-lg shadow-sm px-3 py-2 border border-border cursor-pointer hover:border-accent/50 flex justify-between items-start gap-2 transition-all duration-200'>
            <p className='text-sm text-text-primary break-words'>{card.title}</p>
            <button
                className='text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger transition-opacity'
                onClick={()=>onDelete(card._id,listId)}
            >
                <FiTrash2 size={14} />
            </button>
        </div>
    )
}

export default Card
