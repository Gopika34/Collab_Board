const EditCardModal = ({cardTitle, cardDescription, setCardTitle, setCardDescription,onEditCard,onClose }) => {
    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50'>
            <form className='w-full max-w-md p-6 bg-surface-elevated rounded-2xl flex flex-col gap-5 shadow-2xl border border-border transform 
                transition-all duration-200 ease-out scale-100' onSubmit={onEditCard}>
                <h1 className='text-text-primary font-bold text-3xl text-center uppercase'>Edit List</h1>
                <div className='flex flex-col justify-center gap-2'>
                    <label htmlFor="cardTitle" className='text-md font-medium text-text-secondary'>Card Title</label>
                    <input type="text" value={cardTitle} onChange={(e) => setCardTitle(e.target.value)}
                        placeholder='Eg., Responsive Design' id='cardTitle' className='rounded-lg text-md p-2 w-full bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 border border-border hover:border-accent/50 transition-colors ease-in duration-300'
                    />
                </div>
                <div className='flex flex-col justify-center gap-2'>
                    <label htmlFor="cardDescription" className='text-md font-medium text-text-secondary'>Card Description</label>
                    <input type="text" value={cardDescription} onChange={(e) => setCardDescription(e.target.value)}
                        placeholder='Eg., Testing web responsiveness' id='cardDescription' className='rounded-lg text-md p-2 w-full bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 border border-border hover:border-accent/50 transition-colors ease-in duration-300'
                    />
                </div>
                <div className='flex justify-center gap-6'>
                    <button type="submit" className='bg-accent hover:bg-accent-hover text-text-primary rounded-xl px-4 py-2 text-md cursor-pointer transition-colors'>Save</button>
                    <button type="button" onClick={onClose} className='bg-surface border border-border text-text-secondary hover:bg-surface-elevated hover:text-text-primary rounded-xl px-4 py-2 text-md cursor-pointer transition-colors'>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default EditCardModal
