const CreateBoardModal = ({ handleCreateBoard, onClose, boardInput, setBoardInput }) => {
    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in'>
            <form className='w-full max-w-md p-6 bg-surface-elevated rounded-2xl flex flex-col gap-5 shadow-2xl border border-border transform 
                transition-all duration-200 ease-out scale-100'
                onSubmit={handleCreateBoard}
            >
                <h2 className='font-bold text-2xl text-center text-text-primary tracking-tight'>Create New Board</h2>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="board-name" className='font-semibold text-sm text-text-secondary uppercase tracking-wider'>Board Name</label>
                    <input autoFocus type="text" placeholder="e.g., Q3 Project Roadmap" className='w-full px-4 py-3 rounded-xl border border-border bg-surface placeholder-text-muted text-text-primary shadow-sm transition-all duration-200 hover:border-accent/50 focus:bg-surface focus:ring-3 focus:ring-accent/30 focus:border-accent focus:outline-none' id='board-name' value={boardInput} onChange={(e) => setBoardInput(e.target.value)} />
                </div>
                <div className='flex items-center gap-6 justify-center mt-2'>
                    <button className='bg-accent rounded-xl px-4 py-2 hover:bg-accent-hover text-text-primary text-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        type="submit" disabled={!boardInput.trim()}
                    >Create</button>
                    <button className='bg-surface border border-border text-text-secondary hover:bg-surface-elevated hover:text-text-primary rounded-xl px-4 py-2 text-md cursor-pointer transition-colors' onClick={onClose} type="button">Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default CreateBoardModal
