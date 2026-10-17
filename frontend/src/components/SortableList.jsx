import { useSortable } from "@dnd-kit/react/sortable";
import { MdDragIndicator } from "react-icons/md";
import ListColumn from "./ListColumn";

const SortableList = ({ list, index, ...props }) => {
    const { ref, handleRef, isDragging } = useSortable({
        id: `list:${list._id}`,
        index,
        type: "list",
        accept: "list"
    });

    return (
        <div
            ref={ref}
            className={isDragging ? "opacity-60" : ""}
        >
            <div className="flex items-start gap-1">
                <button
                    ref={handleRef}
                    type="button"
                    title="Drag list"
                    aria-label={`Drag list ${list.title}`}
                    className="mt-3 cursor-grab touch-none text-text-muted hover:text-text-primary active:cursor-grabbing"
                >
                    <MdDragIndicator size={22} />
                </button>

                <div className="min-w-0">
                    <ListColumn list={list} {...props} />
                </div>
            </div>
        </div>
    );
};

export default SortableList;
