import { useEffect, useState } from "react";
import { Icon } from '@iconify/react';

export default function ImageViewer({ image, clickNextHandler, clickBackHander, closeHandler, updateTagHandler }) {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [newTag, setNewTag] = useState("");
    const [tags, setTags] = useState([]);
    const [showUpdateBtn, setShowUpdateBtn] = useState(false);

    useEffect(() => {
        setTags(image.tags);
    }, [image])

    let img = new Image();
    img.src = `http://localhost:8000/files/${image.code}`;

    img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
    }
    const handleOnClick = (e) => {
        if (e.target === e.currentTarget) {
            closeHandler();
        }
    }

    const calculateFileSize = (size) => {
        let units = ["byte", "kB", "MB", "GB"]
        let i = 0;
        while (size > 1000 && i < 4) {
            size = size / 1000;
            i++;
        }
        return `${size} ${units[i]}`
    }

    const editTagHandler = (e) => {
        setNewTag(e.target.value);
    }

    const keyDownHandler = (key) => {
        if (key.code === "Backspace" && newTag === "" && tags.length > 0) {
            deleteTagHandler(tags[tags.length - 1].id);
            setShowUpdateBtn(true);
        } else if (key.code === "Enter" && newTag !== "") {
            addTagHandler(newTag);
            setNewTag("");
            setShowUpdateBtn(true);
        }
    }

    const deleteTagHandler = (tagId) => {
        setTags(tags.filter((tag) => tag.id !== tagId));
        setShowUpdateBtn(true);
    }

    const addTagHandler = (label) => {
        setTags([...tags, { id: Math.random(), label: label }])
    }

    const saveTagsHandler = async () => {
        updateTagHandler(image.id, tags);
        const res = await fetch(`http://localhost:8000/files/${image.id}/tags`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(tags.map((tag) => tag.label))
        });
        if (res.status === 200) {
            console.log(await res.json());
        } else if (res.status === 401) {
            window.location.href = "/login";
        }
    }
    return (
        <div className="relative z-10">
            <div className="md:grid md:grid-cols-10 fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                <div className="md:col-span-7 flex justify-between items-center md:h-screen h-[50vh]" onClick={handleOnClick}>
                    <button className="bg-transparent text-white font-bold text-5xl" onClick={() => clickBackHander(image.id)}>&lt;</button>
                    <div className="h-full flex justify-center items-center" onClick={handleOnClick}>
                        <img className="my-auto max-h-full" src={`http://localhost:8000/files/${image.code}`} />
                    </div>
                    <button className="bg-transparent text-white font-bold text-5xl" onClick={() => clickNextHandler(image.id)}>&gt;</button>
                </div>
                <div className="md:rounded-none md:col-span-3 md:h-screen h-[50vh] rounded-t-xl bg-white p-4 overflow-auto">
                    <p className="font-bold text-4xl py-8 text-sky-700">Info</p>
                    <div className="grid grid-cols-3 gap-4">
                        <p className="col-span-1 font-bold">Name</p>
                        <p className="col-span-2 break-words">{image.name}</p>
                        <p className="col-span-1 font-bold">MIME type</p>
                        <p className="col-span-2">{image.content_type}</p>
                        <p className="col-span-1 font-bold">Size</p>
                        <p className="col-span-2">{calculateFileSize(image.size)}</p>
                        <p className="col-span-1 font-bold">Width</p>
                        <p className="col-span-2">{width} px</p>
                        <p className="col-span-1 font-bold">Height</p>
                        <p className="col-span-2">{height} px</p>
                        <p className="col-span-1 font-bold">Tags</p>
                        <div className="col-span-2 flex gap-2 flex-wrap rounded-xl border-black border-[1px] p-2">
                            {
                                tags?.map((tag, key) => (
                                    <Tag key={key} tag={tag} deleteTagHandler={deleteTagHandler} />
                                ))
                            }
                            <input type="text" autoFocus className="min-w-[30px] border-none focus:outline-none basis-0 grow" onChange={editTagHandler} onKeyDown={keyDownHandler} value={newTag} />
                        </div>
                    </div>
                    {showUpdateBtn && <button className="m-auto block rounded mt-8" onClick={saveTagsHandler}>Save</button>}
                </div>
            </div>
        </div>

    )
}

function Tag({ tag, deleteTagHandler }) {
    return (
        <div className="p-1 bg-blue-200 rounded items-center flex gap-2">
            <p className="font-bold text-sky-700 italic">#{tag.label}</p>
            <Icon icon="mingcute:close-fill" className="font-bold text-sky-100 hover:text-sky-700 cursor-pointer" onClick={() => { deleteTagHandler(tag.id) }} />
        </div>
    )
}
