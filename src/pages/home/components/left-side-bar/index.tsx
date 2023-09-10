import { useEffect, useState } from "react";
import { Icon } from '@iconify/react';
import UserTagEditor from "./user-tags-editor";
import { Tag } from "../..";

interface LeftSideBarProps {
    changeTagHandler: (id: number | null) => void,
    currentTag: number
}
export default function LeftSideBar({ changeTagHandler, currentTag }: LeftSideBarProps) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [showUserTagEditor, setShowUserTagEditor] = useState(false)

    const reduceLabel = (label: string) => (label.length > 20 ? label.substring(0, 20) + "..." : label)

    useEffect(() => {
        fetch('http://localhost:8000/tags', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(response => response.json())
            .then(data => setTags(data))
            .catch(error => console.log(error))
    }, [])

    return (
        <>
            {showUserTagEditor &&
                <UserTagEditor
                    closeHandler={() => setShowUserTagEditor(false)}
                />}
            <div className="bg-white pr-4 fixed top-20 w-[70vw] md:w-[30vw] z-100 max-w-[330px] justify-between flex flex-col h-[90vh]">
                <div>
                    <div className={`pl-4 flex items-center ${currentTag == null ? 'bg-sky-200 rounded-r-full' : ''}`} onClick={() => changeTagHandler(null)}>
                        <Icon icon="tabler:photo-filled" className="text-sky-700 text-2xl" />
                        <button className={`text-sky-700 font-bold text-2xl ${currentTag == null ? 'bg-sky-200' : 'bg-white'}`}>Photos </button>
                    </div>
                    <div className="max-h-[70vh] overflow-auto">

                        {tags.map((tag, key) => (
                            <div key={key} className={`pl-4 flex items-center cursor-pointer ${currentTag == tag.id ? 'bg-sky-200 rounded-r-full' : ''}`} onClick={() => changeTagHandler(tag.id)}>
                                <button className={`text-sky-700 font-bold text-2xl ${currentTag == tag.id ? 'bg-sky-200' : 'bg-white'}`}># {reduceLabel(tag.label)} </button>
                                <p className="text-sky-700 font-bold text-xl">({tag.count})</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`pl-4 flex items-center`} onClick={() => setShowUserTagEditor(true)}>
                    <Icon icon="fluent:edit-20-filled" className="text-sky-700 text-2xl" />
                    <button className={`text-sky-700 font-bold text-2xl bg-white`}>Edit tags </button>
                </div>
            </div>
        </>
    )
}
