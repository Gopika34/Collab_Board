const BoardHeader = ({board}) => {
    return (
        <div>
            <h1 className='text-2xl font-bold text-text-primary text-center uppercase'>{board.title}</h1>
        </div>
    )
}

export default BoardHeader
