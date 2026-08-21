const CreateBoardModal = ({ handleCreateBoard, onClose, boardInput, setBoardInput }) => {
    return (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in'>
            <form className='w-full max-w-md p-6 bg-mauve-300 rounded-2xl flex flex-col gap-5 shadow-2xl border border-white/10 transform 
                transition-all duration-200 ease-out scale-100'
                onSubmit={handleCreateBoard}
            >
                <h2 className='font-bold text-2xl text-center text-slate-800 tracking-tight'>Create New Board</h2>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="board-name" className='font-semibold text-sm text-slate-700 uppercase tracking-wider'>Board Name</label>
                    <input autoFocus type="text" placeholder="e.g., Q3 Project Roadmap" className='w-full px-4 py-3 rounded-xl border border-slate-300 bg-white/80 placeholder-slate-400 text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-400 focus:bg-white focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none' id='board-name' value={boardInput} onChange={(e) => setBoardInput(e.target.value)} />
                </div>
                <div className='flex items-center gap-6 justify-center mt-2'>
                    <button className='bg-blue-500 rounded-xl px-4 py-2 hover:bg-blue-600 text-white text-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                        type="submit" disabled={!boardInput.trim()}
                    >Create</button>
                    <button className='bg-gray-700 text-white hover:bg-gray-800 rounded-xl px-4 py-2 text-md cursor-pointer' onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default CreateBoardModal
