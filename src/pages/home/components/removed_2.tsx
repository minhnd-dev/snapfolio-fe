import { Icon } from '@iconify/react';
import PopUp from './popup';
import { useEffect, useState } from 'react';

export default function TagEditor({ closeHandler }) {
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");

    const deleteTag = (tagId) => {
        setTags(tags.filter((tag) => tag.id !== tagId));
    }

    useEffect(() => {
        fetch('http://localhost:8000/tags', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(response => response.json())
            .then(data =>  setTags(data))
            .catch(error => console.log(error))
    }, [])

    const setNewValue = (tagId, newValue) => {
        setTags(tags.map((tag) => tag.id === tagId ? {...tag, label: newValue} : tag))
    }

    const onKeyDown = (e) => {
        if (e.code === "Enter" && newTag !== "") {
            setTags([{label: newTag, id: Math.random()}, ...tags])
            setNewTag("");
        } 
    }

    const saveTagHandler = () =>  {
        fetch('http://localhost:8000/tags', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(tags.map((tag) => tag.id >= 1 ? tag : {...tag, id: null}))
        })
            .then(response => response.json())
            .then(closeHandler())
            .catch(error => console.log(error))
    }

    return (
        <PopUp
            closeHandler={closeHandler}
            content={
                <div className="">
                    <div className="py-1 flex justify-end">
                        <Icon icon="ion:close" className="text-3xl text-slate-500 cursor-pointer" onClick={closeHandler} />
                    </div>
                    <p className="text-2xl font-bold text-sky-700">Edit Tags</p>
                    <input type="text" className="w-0" onKeyDown={onKeyDown} onChange={(e) => setNewTag(e.target.value)} value={newTag}/>
                    <div className='max-h-[40vh] overflow-auto'>
                        {
                            tags.map((tag, key) => (
                                <div key={key} className="items-center grid grid-cols-7 gap-2 m-2 max-h-[40vh] overflow-auto text-left">
                                    <EditOneTag tag={tag} deleteTag={deleteTag} setNewValue={setNewValue} />
                                </div>
                            ))
                        }
                    </div>
                    <button className="rounded-lg p-2" onClick={saveTagHandler}>Save</button>
                </div>
            }
        />
    )
}

function EditOneTag({ tag, deleteTag, setNewValue }) {
    const [inEdit, setInEdit] = useState(false);
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(tag.label);
        setInEdit(false);
    }, [tag.id])

    const clickPencilHandler = () => {
        if (inEdit) {
            setNewValue(tag.id, "");
        }
        setInEdit(!inEdit);
    }
    const edit = (e) => {
        setNewValue(tag.id, e.target.value);
        setValue(e.target.value);
    }
    return (
        <>
            <Icon className="col-span-1 font-bold text-red-700 cursor-pointer" icon="fluent:delete-12-filled" onClick={() => {deleteTag(tag.id)}} />
            {inEdit ? <input type="text" className="col-span-5" onChange={edit} value={value} autoFocus/> : <p className="col-span-5">{tag.label}</p>}
            <Icon  icon="fluent:edit-20-filled" className="text-sky-700 col-span-1 cursor-pointer" onClick={clickPencilHandler} />
        </>
    )
}
