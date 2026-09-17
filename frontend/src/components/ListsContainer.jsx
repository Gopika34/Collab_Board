import { useState } from "react";
import { MdAddToPhotos } from "react-icons/md";
import CreateListModal from "./CreateListModal";
import { useBoard } from "../context/BoardContext";
import ListColumn from "./ListColumn";

const ListsContainer = () => {
    const [listTitle, setListTitle] = useState("");
    const [listModal, setListModal] = useState(false);

    const{lists} = useBoard();
    const { addList,cardsByListId,addCard,removeList, removeCard, editList,editCard} = useBoard();

    const handleCreateList = async () => {
        if (!listTitle.trim()) return;

        await addList(listTitle);

        setListTitle("");
        setListModal(false);
    };

    const openListModal = () => setListModal(true);
    const closeListModal = () => {
        setListModal(false);
        setListTitle("");
    }


    return (
        <div className='w-full flex gap-3'>
            {
                lists.map((list) => (
                    <ListColumn
                        key={list._id}
                        list={list}
                        listTitle={listTitle} 
                        setListTitle={setListTitle}
                        cards={cardsByListId[list._id] || []}
                        onAddCard={addCard}
                        onDeleteList={removeList}
                        onDeleteCard={removeCard}
                        // onDeleteCard={(cardId) => removeCard(cardId, list._id)}
                        onEditList={editList}
                        onEditCard={editCard}
                    />
                ))
            }
            <button className='bg-accent p-3 flex items-center gap-1 text-text-primary rounded-xl shadow-xl hover:bg-accent-hover transition-colors'
                onClick={openListModal}
            >
                <MdAddToPhotos />
                <span>Add List</span>
            </button>
            {
                listModal &&
                (
                    <CreateListModal
                        listTitle={listTitle}
                        setListTitle={setListTitle}
                        handleCreateList={handleCreateList}
                        onClose={closeListModal}
                    />
                )
            }
        </div>
    )
}

export default ListsContainer
