import React, { useState } from "react";
import { Tag } from "..";
import TagItem from "./tag";

interface TagInputProps {
    tags: Tag[],
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>,
    className: string
}

export default function TagInput({ tags, setTags, className = ""}: TagInputProps) {
    const [newTag, setNewTag] = useState("");

    const editTagHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTag(e.target.value);
    }

    const addTagHandler = (label: string) => {
        setTags([...tags, { id: Math.random(), label: label }])
    }

    const keyDownHandler = (key: React.KeyboardEvent<HTMLInputElement>) => {
        if (key.code === "Backspace" && newTag === "" && tags.length > 0) {
            deleteTagHandler(tags[tags.length - 1].id);
        } else if (key.code === "Enter" && newTag !== "") {
            addTagHandler(newTag);
            setNewTag("");
        }
    }

    const deleteTagHandler = (tagId: number) => {
        setTags(tags.filter((tag) => tag.id !== tagId));
    }

    return (
        <div className={`flex flex-wrap gap-2 rounded-xl border-black border-[1px] p-2 ${className}`}>
            {
                tags?.map((tag, key) => (
                    <TagItem key={key} tag={tag} deleteTagHandler={deleteTagHandler} />
                ))
            }
            <input
                type="text"
                autoFocus
                value={newTag}
                onChange={editTagHandler}
                onKeyDown={keyDownHandler}
                className="min-w-[30px] border-none focus:outline-none basis-0 grow"
            />
        </div>
    )
}
