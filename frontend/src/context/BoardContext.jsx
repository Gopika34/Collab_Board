import { createContext, useContext, useState, useEffect } from "react";
import { getLists, createList as createListApi, deleteList as deleteListApi, updateList as updateListAPi } from '../api/lists';
import { getBoard } from '../api/boards';
import { getCards as getCardApi, createCard, updateCards, deleteCards } from "../api/cards";
import { move } from "@dnd-kit/helpers";
import { socket } from "../socket/socket";

const BoardContext = createContext();

export const BoardProvider = ({ children, boardId }) => {
    const [board, setBoard] = useState({});
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [cardsByListId, setCardsByListId] = useState({});


    // ─── Socket.IO: connect to board room & listen for real-time updates ───
    useEffect(() => {
        if (!boardId) return;

        const handleConnect = () => {
            socket.emit(
                "board:join",
                { boardId },
                (response) => {
                    if (response?.ok) {
                        console.log("Joined Socket.IO board room:", response.boardId);
                    } else {
                        console.error("Could not join board room:", response?.message);
                    }
                }
            );
        };

        // ── Incoming real-time event handlers ──────────────────────────────

        const handleListCreated = ({ list }) => {
            setLists(prev => {
                // Avoid duplicates — the creator already applied the change optimistically via REST response
                if (prev.some(l => l._id === list._id)) return prev;
                return [...prev, list];
            });
            // Initialise an empty card bucket for the new list
            setCardsByListId(prev => ({
                ...prev,
                [list._id]: prev[list._id] ?? []
            }));
        };

        const handleListUpdated = ({ list }) => {
            setLists(prev =>
                prev.map(l => l._id === list._id ? list : l)
            );
        };

        const handleListDeleted = ({ listId }) => {
            setLists(prev => prev.filter(l => l._id !== listId));
            setCardsByListId(prev => {
                const updated = { ...prev };
                delete updated[listId];
                return updated;
            });
        };

        const handleCardCreated = ({ card, listId }) => {
            const cardWithId = { ...card, id: card._id };
            setCardsByListId(prev => {
                const existing = prev[listId] || [];
                if (existing.some(c => c._id === card._id)) return prev;
                return { ...prev, [listId]: [...existing, cardWithId] };
            });
        };

        const handleCardUpdated = ({ card, listId }) => {
            const cardWithId = { ...card, id: card._id };
            setCardsByListId(prev => {
                // Card might have moved lists — check both old and new listId
                const updated = { ...prev };
                // Remove from any list that currently holds it
                for (const lid in updated) {
                    updated[lid] = updated[lid].filter(c => c._id !== card._id);
                }
                // Add/replace in the correct list
                updated[listId] = [...(updated[listId] || []), cardWithId].sort(
                    (a, b) => a.order - b.order
                );
                return updated;
            });
        };

        const handleCardDeleted = ({ cardId, listId }) => {
            setCardsByListId(prev => ({
                ...prev,
                [listId]: (prev[listId] || []).filter(c => c._id !== cardId)
            }));
        };

        // Register all listeners
        socket.on("list:created", handleListCreated);
        socket.on("list:updated", handleListUpdated);
        socket.on("list:deleted", handleListDeleted);
        socket.on("card:created", handleCardCreated);
        socket.on("card:updated", handleCardUpdated);
        socket.on("card:deleted", handleCardDeleted);

        socket.on("connect", handleConnect);
        socket.connect();

        // Handles an already-connected socket (e.g. hot reload)
        if (socket.connected) {
            handleConnect();
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("list:created", handleListCreated);
            socket.off("list:updated", handleListUpdated);
            socket.off("list:deleted", handleListDeleted);
            socket.off("card:created", handleCardCreated);
            socket.off("card:updated", handleCardUpdated);
            socket.off("card:deleted", handleCardDeleted);

            if (socket.connected) {
                socket.emit("board:leave", { boardId });
            }

            socket.disconnect();
        };
    }, [boardId]);

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
            const res = await getLists(boardId);
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
            setLists(prev => {
                // Guard against duplicates from socket echo
                if (prev.some(l => l._id === res.data._id)) return prev;
                return [...prev, res.data];
            });
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

            setCardsByListId(prev => {
                const existing = prev[listId] || [];
                // Guard against duplicates from socket echo
                if (existing.some(c => c._id === res.data._id)) return prev;
                return {
                    ...prev,
                    [listId]: [...existing, res.data]
                };
            });

            return true;
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to create card!");
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
            setError(err.response?.data?.message || "Failed to update card!");
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
            setError(err.response?.data?.message || "Failed to delete card!");
        }
    };

    const handleDragMove = (event) => {
        setCardsByListId(prev => move(prev, event));
    };

    const handleDragEnd = async (event) => {
        if (event.canceled) return;

        const { source } = event.operation;
        if (!source) return;

        // The list(s) touched by this drag — could be one (reorder) or two (cross-list move)
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
            handleDragEnd
        }}
        >{children}
        </BoardContext.Provider>
    )
}

export const useBoard = () => {
    return useContext(BoardContext)
}
