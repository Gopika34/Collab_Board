import { useSortable } from "@dnd-kit/react/sortable";

const SortableCard = ({ card, index, listId, children }) => {

    const {
        ref,
        isDragging
    } = useSortable({
        id: card._id,
        index,
        group: listId,
        type: "card",
        accept: "card"
    });

    return (
        <div
            ref={ref}
            className={isDragging ? "opacity-50" : ""}
        >
            {children}
        </div>
    )
}

export default SortableCard
