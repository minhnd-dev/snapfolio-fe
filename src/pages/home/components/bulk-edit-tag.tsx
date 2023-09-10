import PopUp from './popup';
import React, { useContext, useEffect, useState } from 'react';
import TagInput from './tag_input';
import { Tag } from '..';
import { AllFilesContext } from '..';

interface BulkEditTagsProps {
    selectAll: boolean,
    closeHandler: () => void 
}
export default function BulkEditTags({ selectAll, closeHandler }: BulkEditTagsProps) {
    const [addedTags, setAddedTags] = useState<Tag[]>([]);
    const [removedTags, setRemovedTags] = useState<Tag[]>([]);

    const { files } = useContext(AllFilesContext);

    const updateImagesTags = () => {
        let fileIds: number[];
        if (selectAll) {
            fileIds = files.filter(file => file.status === false).map(file => file.id);
        } else {
            fileIds = files.filter(file => file.status).map(file => file.id);
        }

        let params = new URLSearchParams()
        params.append("select_all", String(Boolean(selectAll)));
        fetch(`http://localhost:8000/files/tags?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify({
                added: addedTags.map(tag => tag.label),
                removed: removedTags.map(tag => tag.label),
                files_ids: fileIds
            }),
        });
        closeHandler();
    }
    return (
        <PopUp
            closeHandler={closeHandler}
            content={
                <div className="m-2">
                    <p className="my-6 font-bold text-2xl text-blue-900 text-center">Add/Remove tags from selected images</p>
                    <div className="grid grid-cols-6 gap-2">
                        <p className="col-span-1">Add</p>
                        <TagInput
                            tags={addedTags}
                            setTags={setAddedTags}
                            className="col-span-5"
                        />
                        <p className="col-span-1">Remove</p>
                        <TagInput
                            tags={removedTags}
                            setTags={setRemovedTags}
                            className="col-span-5"
                        />
                    </div>
                    <button className="mt-4 rounded-lg" onClick={updateImagesTags}>Save</button>
                </div>
            }
        />
    )
}
