import { useContext, useEffect, useState } from "react";
import { AllFilesContext, UserFile, Tag } from "../..";
import TagItem from "../tag";

interface FileViewerProps {
    fetchNextPage: () => Promise<void>
}
export default function FileViewer({ fetchNextPage } : FileViewerProps) {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [newTag, setNewTag] = useState("");
    const [tags, setTags] = useState<Tag[]>([]);
    const [showUpdateBtn, setShowUpdateBtn] = useState(false);
    const [image, setImage] = useState<UserFile>();

    const { files, setFiles } = useContext(AllFilesContext);

    useEffect(() => {
        setImage(files.find(file => file.isCurrent));
        setTags(files.find(file => file.isCurrent)?.tags || [])
    }, [files])

    let img = new Image();
    for (const file of files) {
        if (file.isCurrent) {
            img.src = `http://localhost:8000/files/${file.code}`;
            break;
        }
    }

    img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
    }

    const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target === e.currentTarget) {
            setFiles(files.map(file => ({ ...file, isCurrent: false })));
        }
    }

    const calculateFileSize = (size: number) => {
        let units = ["byte", "kB", "MB", "GB"]
        let i = 0;
        while (size > 1000 && i < 4) {
            size = size / 1000;
            i++;
        }
        return `${size} ${units[i]}`
    }

    const editTagHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTag(e.target.value);
    }

    const keyDownHandler = (key: React.KeyboardEvent<HTMLInputElement>) => {
        if (key.code === "Backspace" && newTag === "" && tags.length > 0) {
            deleteTagHandler(tags[tags.length - 1].id);
            setShowUpdateBtn(true);
        } else if (key.code === "Enter" && newTag !== "") {
            addTagHandler(newTag);
            setNewTag("");
            setShowUpdateBtn(true);
        }
    }

    const deleteTagHandler = (tagId: number) => {
        setTags(tags.filter((tag) => tag.id !== tagId));
        setShowUpdateBtn(true);
    }

    const addTagHandler = (label: string) => {
        setTags([...tags, { id: Math.random(), label: label }])
    }

    const saveTagsHandler = async () => {
        if (!image) return;

        setFiles(
            files.map(file => (file.id === image.id ? { ...file, tags: tags } : file))
        )
        const res = await fetch(`http://localhost:8000/files/${image.id}/tags`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(tags.map((tag) => tag.label))
        });
        if (res.status === 200) {
            await res.json();
        } else if (res.status === 401) {
            window.location.href = "/login";
        }
    }

    const clickNextHandler = async () => {
        for (let i = 0; i < files.length - 1; i++) {
            if (files[i]?.isCurrent) {
                setFiles(
                    files.map((file, id) => (
                        id === i + 1 ? { ...file, isCurrent: true } : { ...file, isCurrent: false }
                    ))
                )
                break;
            }
        }
        if (files[files.length - 2].isCurrent) {
            await fetchNextPage();
        }
    }

    const clickBackHandler = () => {
        for (let i = files.length - 1; i > 0; i--) {
            if (files[i]?.isCurrent) {
                setFiles(
                    files.map((file, id) => (
                        id === i - 1 ? { ...file, isCurrent: true } : { ...file, isCurrent: false }
                    ))
                )
                break;
            }
        }
    }
    return (
        <div className="relative z-10">
            {image &&
                <div className="md:grid md:grid-cols-10 fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
                    <div className="md:col-span-7 flex justify-between items-center md:h-screen h-[50vh]" onClick={handleOnClick}>
                        <button className="bg-transparent text-white font-bold text-5xl" onClick={clickBackHandler}>&lt;</button>
                        <div className="h-full flex justify-center items-center" onClick={handleOnClick}>
                            <img className="my-auto max-h-full" src={`http://localhost:8000/files/${image.code}`} />
                        </div>
                        <button className="bg-transparent text-white font-bold text-5xl" onClick={clickNextHandler}>&gt;</button>
                    </div>
                    <div className="md:rounded-none md:col-span-3 md:h-screen h-[50vh] rounded-t-xl bg-white p-4 overflow-auto">
                        <p className="font-bold text-4xl py-8 text-sky-700">Info</p>
                        <div className="grid grid-cols-3 gap-4">
                            {
                                [
                                    { label: "Name", value: image?.name },
                                    { label: "MIME type", value: image?.content_type },
                                    { label: "Size", value: calculateFileSize(image?.size) },
                                    { label: "Width", value: width },
                                    { label: "Height", value: height },
                                ].map((row, key) => (
                                    <>
                                        <p className="col-span-1 font-bold">{row.label}</p>
                                        <p key={key} className="col-span-2 break-words">{row.value}</p>
                                    </>
                                ))

                            }
                            <p className="col-span-1 font-bold">Tags</p>
                            <div className="col-span-2 flex gap-2 flex-wrap rounded-xl border-black border-[1px] p-2">
                                {
                                    tags?.map((tag, key) => (
                                        <TagItem key={key} tag={tag} deleteTagHandler={deleteTagHandler} />
                                    ))
                                }
                                <input type="text" autoFocus className="min-w-[30px] border-none focus:outline-none basis-0 grow" onChange={editTagHandler} onKeyDown={keyDownHandler} value={newTag} />
                            </div>
                        </div>
                        {showUpdateBtn && <button className="m-auto block rounded mt-8" onClick={saveTagsHandler}>Save</button>}
                    </div>
                </div>
            }
        </div>

    )
}

