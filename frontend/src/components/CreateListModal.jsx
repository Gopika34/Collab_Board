import React from 'react'

const CreateListModal = ({ listTitle, setListTitle, handleCreateList, onClose }) => {
    return (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50'>
            <form className='w-full max-w-md p-6 bg-mauve-300 rounded-2xl flex flex-col gap-5 shadow-2xl border border-white/10 transform 
                transition-all duration-200 ease-out scale-100' onSubmit={handleCreateList}>
                <h1 className='text-slate-700 font-bold text-3xl text-center uppercase'>Create New List</h1>
                <div className='flex flex-col justify-center gap-2'>
                    <label htmlFor="listTitle" className='text-md font-medium text-slate-900'>List Name</label>
                    <input type="text" value={listTitle} onChange={(e) => setListTitle(e.target.value)}
                        placeholder='Eg., To-be done' id='listTitle' className='rounded-lg text-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-400 hover:border-blue-600 transition-colors ease-in duration-300'
                    />
                </div>
                <div className='flex justify-center gap-12'>
                    <button>Create</button>
                    <button>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default CreateListModal
