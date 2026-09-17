import { FiTrash2 } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import EditCardModal from "./EditCardModal";

const Card = ({ card, onDelete, listId, onEdit, cardTitle, cardDescription, setCardTitle, setCardDescription, editCardModal, setEditCardModal }) => {

    const handleEditCard = async (e) => {
        e.preventDefault();

        if (!cardTitle.trim() && !cardDescription.trim()) return

        await onEdit(card._id, listId, cardTitle, cardDescription);

        setCardTitle("");
        setCardDescription("");
        setEditCardModal(false);
    }

    const openEditCardModal = () => {
        setCardTitle(card.title);
        setCardDescription(card?.description);
        setEditCardModal(true);
    }

    const closeEditCardModal = () => {
        setEditCardModal(false);
        setCardTitle("");
        setCardDescription("");
    }
    return (
        <div className='group bg-surface-elevated rounded-lg shadow-sm px-3 py-2 border border-border cursor-pointer hover:border-accent/50 flex justify-between items-start gap-2 transition-all duration-200'>
            <p className='text-sm text-text-primary break-words'>{card.title}</p>
            <div className="flex justify-around gap-3">
                <button
                    className='text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger transition-opacity'
                    onClick={openEditCardModal}
                >
                    <MdEdit size={14} />
                </button>
                <button
                    className='text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger transition-opacity'
                    onClick={() => onDelete(card._id, listId)}
                >
                    <FiTrash2 size={14} />
                </button>
            </div>
            {
                editCardModal && (
                    <EditCardModal 
                        cardTitle={cardTitle} 
                        setCardTitle={setCardTitle} 
                        cardDescription={ cardDescription}  
                        setCardDescription={setCardDescription}
                        onEditCard={handleEditCard}
                        onClose={closeEditCardModal}
                    />
                )
            }
        </div>
    )
}

export default Card
