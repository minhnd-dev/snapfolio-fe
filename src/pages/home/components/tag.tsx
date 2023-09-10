import { Icon } from "@iconify/react";
import { Tag } from ".."

interface TagItemProps {
    tag: Tag,
    deleteTagHandler: (id: number) => void
}

export default function TagItem({ tag, deleteTagHandler }: TagItemProps) {
    return (
        <div className="p-1 bg-blue-200 rounded items-center flex gap-2">
            <p className="font-bold text-sky-700 italic">#{tag.label}</p>
            <Icon icon="mingcute:close-fill" className="font-bold text-sky-100 hover:text-sky-700 cursor-pointer" onClick={() => { deleteTagHandler(tag.id) }} />
        </div>
    )
}
