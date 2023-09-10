import { Icon } from '@iconify/react';
import PopUp from './popup';
import { useContext, useState, Dispatch } from 'react';
import { AllFilesContext, UserFile } from '..';
import BulkEditTags from './bulk-edit-tag';

interface EditHeaderProps {
    selectAll: boolean,
    setSelectAll: React.Dispatch<React.SetStateAction<boolean>>
}
export default function EditHeader({ selectAll, setSelectAll } : EditHeaderProps) {
    const [showDeleteDiaglog, setShowDeleteDiaglog] = useState(false);
    const [showEditFileTags, setShowEditFilesTags] = useState(false);

    const { files, setFiles } = useContext(AllFilesContext);

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        setFiles(files.map(file => ({...file, status: !selectAll})))
    }

    const cancelHandler = () => {
        setFiles(
            files.map((image) => ({ ...image, status: false }))
        );
    }

    const deleteImagesHandler = async () => {
        let deletedFiles: number[];
        if (selectAll) {
            deletedFiles = files.filter(file => file.status === false).map(file => file.id);
        } else {
            deletedFiles = files.filter(file => file.status).map(file => file.id);
        }

        if (deletedFiles.length === 0) return;

        let params = new URLSearchParams()
        params.append("select_all", String(Boolean(selectAll)));
        await fetch(`http://localhost:8000/files/multiple?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json',
            },
            method: 'DELETE',
            body: JSON.stringify(deletedFiles),
        });
        setFiles(files.filter(file => file.status !== true));
    }

    return (
        <>
            {
                showEditFileTags && 
                <BulkEditTags
                    selectAll = {selectAll}
                    closeHandler={() => setShowEditFilesTags(false)} 
                />
            }
            {showDeleteDiaglog &&
                <DeleteDialog
                    setShow={setShowDeleteDiaglog}
                    deleteHandler={deleteImagesHandler}
                />
            }
            <div className="grid grid-cols-2 gap-2 p-2 fixed top-0 border-b-[1px] border-slate-400 bg-slate-100 w-full h-16">
                <div className="col-span-1 flex gap-2 items-center">
                    {
                        selectAll
                            ? <Icon icon="icon-park-solid:check-one" onClick={toggleSelectAll} className="m-2 text-4xl text-sky-700 rounded-full cursor-pointer" />
                            : <Icon icon="icon-park-outline:check-one" onClick={toggleSelectAll} className="m-2 text-4xl text-sky-700 rounded-full cursor-pointer"/>
                    }
                    <label htmlFor="select-all" className="text-xl font-bold text-sky-700 cursor-pointer" onClick={toggleSelectAll}>Select all</label>
                </div>
                <div className="col-span-1 flex justify-end gap-3 items-center text-4xl">
                    <Icon icon="solar:tag-bold" className="font-bold text-sky-700 cursor-pointer" onClick={() => setShowEditFilesTags(true)}/>
                    <Icon className="text-red-700 cursor-pointer" onClick={() => setShowDeleteDiaglog(true)} icon="fluent:delete-12-filled" />
                    <Icon icon="ion:close" className="text-slate-500 cursor-pointer" onClick={cancelHandler} />
                </div>
            </div>
        </>
    )
}

interface DeleteDialogProps {
    setShow: Dispatch<React.SetStateAction<boolean>>,
    deleteHandler: () => Promise<void>
}
function DeleteDialog({ setShow, deleteHandler }: DeleteDialogProps) {
    const closeHanlder = () => {
        setShow(false);
    }
    const yesHandler = () => {
        setShow(false);
        deleteHandler();
    }
    return (
        <PopUp
            closeHandler={closeHanlder}
            content={
                <div className="m-2 max-w-lg">
                    <p className="p-2 text-2xl mb-4">Are you sure to delete these photos?</p>
                    <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg bg-red-700" onClick={yesHandler}>Yes</button>
                        <button className="p-2 rounded-lg" onClick={closeHanlder}>No</button>
                    </div>
                </div>
            }
        />
    )
}
