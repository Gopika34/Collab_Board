import { createContext, useContext, useEffect, useState } from "react";
import { getLists, createList as createListApi } from '../api/lists';
import { getBoard } from '../api/boards';
import { useParams } from "react-router-dom";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
    const [board, setBoard] = useState({});
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { id: boardId } = useParams();

    const fetchBoardById = async () => {
        setLoading(true);
        try {
            const res = await getBoard(boardId);
            setBoard(res.data);
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to fetch!");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBoardById();
    }, [boardId]);

    const fetchListsByBoardId = async () => {
        try {
            console.log("fetching lists for boardId:", boardId);
            const res = await getLists(boardId);
            console.log("lists from API:", res.data);
            setLists(res.data);
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to fetch!");
        }
    }

    const removeList = async (listId) => {
        try {
            await deleteListApi(listId);
            fetchListsByBoardId();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete list!");
        }
    }

    useEffect(() => {
        fetchListsByBoardId();
    }, [boardId]);

    const addList = async ({ title }) => {
        try {
            await createListApi({ title, boardId });
            fetchListsByBoardId();
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to create list!");
        }
    }
    return (
        <BoardContext.Provider value={{
            board,
            lists,
            error,
            loading,
            fetchListsByBoardId,
            addList,
            fetchBoardById,
            removeList
        }
        }>{children}
        </BoardContext.Provider>
    )
}

export const useBoard = () => {
    // return useContext(BoardContext);
    const context = useContext(BoardContext);
    console.log("Board Context:", context);
    return context;
}