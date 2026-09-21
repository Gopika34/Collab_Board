import { createContext, useContext, useState, useEffect } from "react";
import { getLists, createList as createListApi, deleteList as deleteListApi, updateList as updateListAPi } from '../api/lists';
import { getBoard } from '../api/boards';
import { getCards as getCardApi, createCard, updateCards, deleteCards } from "../api/cards";
import { move } from "@dnd-kit/helpers";

const BoardContext = createContext();

export const BoardProvider = ({ children, boardId }) => {
    const [board, setBoard] = useState({});
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [cardsByListId, setCardsByListId] = useState({});

    const normalizeCardOrders = (cards) => {
        return cards.map((card, index) => ({
            ...card,
            order: index
        }));
    };


    const fetchBoardById = async () => {
        setLoading(true);
        try {
            setError("");
            const res = await getBoard(boardId);
            setBoard(res.data);
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to fetch board!");
        }
        finally {
            setLoading(false);
        }
    }

    const fetchListsByBoardId = async () => {
        try {
            setError("");
            // console.log("fetching lists for boardId:", boardId);
            const res = await getLists(boardId);
            // console.log("lists from API:", res.data);
            setLists(res.data);
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to fetch lists!");
        }
    }


    const addList = async (title) => {
        try {
            setError("");

            const nextOrder = lists.length === 0
                ? 0
                : Math.max(...lists.map(list => list.order)) + 1;

            const res = await createListApi({ title, boardId, order: nextOrder });
            setLists(prev => [...prev, res.data]);
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to create list!");
        }
    }

    const editList = async (listId, title) => {
        try {
            setError("");
            const res = await updateListAPi(listId, { title });
            setLists(prev =>
                prev.map(list =>
                    list._id === listId ? res.data : list
                ));
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to update list!");
        }
    }

    const removeList = async (listId) => {
        try {
            setError("");
            await deleteListApi(listId);
            setLists(prev => prev.filter(l => l._id !== listId));
            setCardsByListId(prev => {
                const updated = { ...prev };
                delete updated[listId];
                return updated;
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete list!");
        }
    }

    const fetchCardsForLists = async () => {
        try {
            setError("")
            const entries = await Promise.all(
                lists.map(async (list) => {
                    const res = await getCardApi(list._id);
                    const cards = res.data.map(card => ({ ...card, id: card._id }));
                    return [list._id, cards];
                })
            )
            setCardsByListId(Object.fromEntries(entries));
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to fetch cards!");
        }
    }

    const addCard = async (listId, title, description) => {
        try {
            setError("");

            const cards = cardsByListId[listId] || [];

            const validOrders = cards
                .map(card => card.order)
                .filter(order => typeof order === "number");

            const nextOrder =
                validOrders.length === 0
                    ? 0
                    : Math.max(...validOrders) + 1;

            const res = await createCard({
                title,
                description,
                listId,
                order: nextOrder
            });

            setCardsByListId(prev => ({
                ...prev,
                [listId]: [
                    ...(prev[listId] || []),
                    res.data
                ]
            }));

            return true;
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to create cards!");
            return false;
        }
    }


    useEffect(() => {
        if (!boardId) return;
        fetchBoardById();
        fetchListsByBoardId();
    }, [boardId]);

    useEffect(() => {
        if (lists.length === 0) {
            setCardsByListId({});
            return;
        }
        fetchCardsForLists();
    }, [lists]);


    const editCard = async (cardId, listId, title, description) => {
        try {
            setError("")
            const res = await updateCards(cardId, { title, description });
            setCardsByListId(prev => ({
                ...prev,
                [listId]: prev[listId].map(card =>
                    card._id === cardId ? res.data : card
                )
            }));
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to update cards!");
        }
    }

    const removeCard = async (cardId, listId) => {
        try {
            setError("")
            await deleteCards(cardId);
            setCardsByListId(prev => ({
                ...prev,
                [listId]: prev[listId].filter(
                    card => card._id !== cardId
                )
            }));
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to delete cards!");
        }
    };

    const handleDragMove = (event) => {
        setCardsByListId(prev => move(prev, event));
    };

    const handleDragEnd = async (event) => {
        if (event.canceled) return;

        const { source } = event.operation;
        if (!source) return;

        // the list(s) touched by this drag — could be one list (reorder)
        // or two (moved between lists)
        const listIds = [...new Set([source.initialGroup, source.group])].filter(Boolean);

        try {
            setError("");
            const requests = listIds.flatMap(listId =>
                (cardsByListId[listId] || []).map((card, index) =>
                    updateCards(card._id, { listId, order: index })
                )
            );
            await Promise.all(requests);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save card position!");
        }
    };

    return (
        <BoardContext.Provider value={{
            board,
            lists,
            error,
            loading,
            fetchBoardById,
            fetchListsByBoardId,
            addList,
            editList,
            removeList,
            cardsByListId,
            fetchCardsForLists,
            addCard,
            editCard,
            removeCard,
            handleDragMove,
            handleDragMove
        }
        }>{children}
        </BoardContext.Provider>
    )
}

export const useBoard = () => {
    return useContext(BoardContext);
}


