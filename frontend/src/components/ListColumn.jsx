import { useState } from 'react'
import { FiTrash2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import Card from './Card.jsx';
import CreateCardModal from './CreateCardModal.jsx';
import { MdEdit } from "react-icons/md";
import EditListModal from './EditListModal.jsx';

const ListColumn = ({ list, listTitle, setListTitle, cards, onAddCard, onDeleteList, onDeleteCard, onEditList, onEditCard }) => {
    const [showCardModal, setShowCardModal] = useState(false);
    const [editListModal, setEditListModal] = useState(false);
    const [cardTitle, setCardTitle] = useState('');
    const [cardDescription, setCardDescription] = useState('');

    const handleCreateCard = async (e) => {
        e.preventDefault();
        if (!cardTitle.trim()) return;
        const success = await onAddCard(list._id, cardTitle, cardDescription);
        if (!success) return;
        setCardTitle('');
        setCardDescription('');
        setShowCardModal(false);
    }

    const openCardModal = () => setShowCardModal(true);
    const closeCardModal = () => {
        setShowCardModal(false);
        setCardTitle("");
        setCardDescription("");
    }

    const openEditListModal = () => {
        setListTitle(list.title);
        setEditListModal(true);
    }
    const closeEditListModal = () => {
        setEditListModal(false);
        setListTitle("");
    }

    const handleEditList = async (e) => {
        e.preventDefault();
        if (!listTitle.trim()) return;

        await onEditList(list._id, listTitle);

        setListTitle("");
        setEditListModal(false);
    }

    return (
        <div className='w-72 shrink-0 bg-surface border border-border rounded-xl shadow-sm flex flex-col max-h-full'>
            <div className='flex justify-between items-center px-3 py-2.5'>
                <h3 className='font-semibold text-sm text-text-primary'>{list.title}</h3>
                <div className='flex gap-6'>
                    <button
                        className='text-text-muted hover:text-danger transition-colors'
                        onClick={() => openEditListModal()}
                    >
                        <MdEdit size={16} />
                    </button>
                    <button
                        className='text-text-muted hover:text-danger transition-colors'
                        onClick={() => onDeleteList(list._id)}
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            </div>

            <div className='flex flex-col gap-2 px-2 pb-2 overflow-y-auto'>
                {cards.map((card) => (
                    <Card key={card._id} card={card} onDelete={onDeleteCard} listId={list._id}/>
                ))}
            </div>

            {showCardModal ? (
                <CreateCardModal
                    cardTitle={cardTitle}
                    setCardTitle={setCardTitle}
                    cardDescription={cardDescription}
                    setCardDescription={setCardDescription}
                    handleCreateCard={handleCreateCard}
                    onClose={closeCardModal}
                />
            ) : (
                <button
                    onClick={openCardModal}
                    className='flex items-center gap-1 mx-2 mb-2 px-3 py-2 text-text-secondary hover:bg-surface-elevated hover:text-text-primary rounded-lg text-sm transition-colors'
                >
                    <FaPlus /> Add Card
                </button>
            )}

            {
                editListModal && (
                    <EditListModal
                        listTitle={listTitle}
                        setListTitle={setListTitle}
                        onClose={closeEditListModal}
                        handleEditList={handleEditList}
                    />
                )
            }
        </div>
    )
}

export default ListColumn
