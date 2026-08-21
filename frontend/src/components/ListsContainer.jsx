import { useState } from "react";
import { MdAddToPhotos } from "react-icons/md";
import CreateListModal from "./CreateListModal";

const ListsContainer = ({lists}) => {
    const [listTitle,setListTitle]=useState("");
    const [listModal,setListModal]=useState(false);

    const handleCreateList =async () => {
        
    }

    const openListModal = ()=> setListModal(true);
    const closeListModal = ()=> setListModal(false);

    return (
        <div className='w-full flex'>
            {
                lists.map((list)=>(
                    <p  key={list._id}>{list.title}</p>
                ))
            }
            <button className='bg-blue-600 p-3 flex items-center gap-1 text-white rounded-xl shadow-xl hover:bg-blue-700'
                onClick={openListModal}
            >
                <MdAddToPhotos />
                <span>Add List</span>
            </button>
            {
                listModal && <CreateListModal listTitle={listTitle} setListTitle={setListTitle} handleCreateList={handleCreateList} onClose={closeListModal}/>
            }
        </div>
    )
}

export default ListsContainer
