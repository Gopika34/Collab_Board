import { useSortable } from "@dnd-kit/react/sortable";
import { MdDragIndicator } from "react-icons/md";

const SortableCard = ({ card, index, listId, children }) => {
    const { ref, handleRef, isDragging } = useSortable({
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
            <div className="flex items-start gap-1">
                <button
                    ref={handleRef}
                    type="button"
                    title="Drag card"
                    aria-label={`Drag ${card.title}`}
                    className="mt-2 cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing"
                >
                    <MdDragIndicator size={20} />
                </button>

                <div className="min-w-0 flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SortableCard;
