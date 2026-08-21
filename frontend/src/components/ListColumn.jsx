import { useState } from 'react'
import { FiTrash2 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import Card from './Card.jsx';

const ListColumn = ({ list, cards, onAddCard, onDeleteList, onDeleteCard }) => {
    const [showInput, setShowInput] = useState(false);
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAddCard(list._id, title);
        setTitle('');
        setShowInput(false);
    }

    return (
        <div className='w-72 shrink-0 bg-gray-100 rounded-xl shadow-sm flex flex-col max-h-full'>
            <div className='flex justify-between items-center px-3 py-2.5'>
                <h3 className='font-semibold text-sm text-slate-700'>{list.title}</h3>
                <button
                    className='text-slate-400 hover:text-red-500 transition-colors'
                    onClick={() => onDeleteList(list._id)}
                >
                    <FiTrash2 size={16} />
                </button>
            </div>

            <div className='flex flex-col gap-2 px-2 pb-2 overflow-y-auto'>
                {cards.map((card) => (
                    <Card key={card._id} card={card} onDelete={onDeleteCard} />
                ))}
            </div>

            {showInput ? (
                <form onSubmit={handleSubmit} className='p-2 flex flex-col gap-2'>
                    <input
                        autoFocus
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter card title..."
                        className='w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <div className='flex gap-2'>
                        <button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors'>
                            Add
                        </button>
                        <button type='button' onClick={() => { setShowInput(false); setTitle(''); }} className='text-slate-500 hover:text-slate-700 text-sm px-3 py-1.5'>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setShowInput(true)}
                    className='flex items-center gap-1 mx-2 mb-2 px-3 py-2 text-slate-500 hover:bg-slate-200 rounded-lg text-sm transition-colors'
                >
                    <FaPlus /> Add Card
                </button>
            )}
        </div>
    )
}

export default ListColumn
