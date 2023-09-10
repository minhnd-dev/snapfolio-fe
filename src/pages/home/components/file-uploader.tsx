import { Icon } from '@iconify/react';
import PopUp from './popup';

export default function FileUploadPopup({ closeHandler }) {
    const dragOverHandler = (e) => {
        e.preventDefault();
    }
    const dropFileHandler = async (e) => {
        e.preventDefault();
        if (e.dataTransfer.items) {
            [...e.dataTransfer.items].map(async (item) => {
                if (item.kind === "file") {
                    const file = item.getAsFile();
                    await upload(file);
                }
            })
        } else {
            [...e.dataTransfer.files].map(async (file) => {
                await upload(file);
            });
        }
        location.reload();
    }

    const upload = async (uploadedFile) => {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        const res = await fetch('http://localhost:8000/files/upload', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            method: 'POST',
            body: formData
        });
        if (res.status === 200) {
            await res.json();
        } else {
            alert("Lỗi upload");
        }
    }

    const chooseFileHandler = (e) => {
        [...e.target.files].forEach((file) => {
            upload(file);
        });
        // location.reload();
    }
    return (
        <>
            <PopUp closeHandler={closeHandler} content={
                <div className="p-2 relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-lg">
                    <div className="py-1 flex justify-end">
                        <Icon icon="ion:close" className="text-3xl text-slate-500 cursor-pointer" onClick={closeHandler} />
                    </div>
                    <div className="bg-slate-200 p-[80px] rounded-lg" onDrop={dropFileHandler} onDragOver={dragOverHandler}>
                        <div className="p-4 border-dashed border-4 border-slate-400 rounded-lg">
                            <p> Drop your photo/video here</p>
                        </div>
                    </div>
                    <div className="py-8">
                        <label htmlFor="avatar" className="cursor-pointer m-auto p-2 bg-slate-500 text-white font-bold text-lg rounded-lg max-w-xs">Choose photo/video</label>
                        <input type="file" id="avatar" name="file" accept="image/png, image/jpeg" className="opacity-0" onChange={chooseFileHandler} />
                    </div>
                </div>
            }
            />
        </>
    )
}

