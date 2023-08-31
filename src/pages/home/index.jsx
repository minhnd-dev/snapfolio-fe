import { useEffect, useState } from "react";
import Header from "./header";
import FileUploadPopup from "./file-uploader"
import ImageList from "./image-list";
export function Home() {
    const [showUpload, setShowUpload] = useState(false);
    const [userFilesData, setUserFilesData] = useState([]);

    useEffect(() => {
        getFiles().then(data => {
            setUserFilesData(data);
        }).catch(err => {
            console.log(err);
        });
    }, [])


    const getFiles = async () => {
        const res = await fetch('http://localhost:8000/files', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (res.status === 200) {
            return await res.json();
        } else if (res.status === 401) {
            window.location.href = "/login";
        }
    }

    if (!localStorage.getItem('token')) {
        window.location.href = '/login';
    }

    const deleteImagesHandler = () => {
        const deletedFiles = userFilesData.filter(file => file.status).map(file => String(file.id));
        console.log(deletedFiles)
        fetch('http://localhost:8000/files/multiple', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json',
            },
            method: 'DELETE',
            body: JSON.stringify(deletedFiles),
        });
        location.reload();
    }
    return (
        <>
            <Header clickDeleteHandler={deleteImagesHandler} clickUploadHandler={() => setShowUpload(true)}/>
            {showUpload && <FileUploadPopup />}
            <div className="h-20 w-1 "></div>
            <ImageList images={userFilesData}/>
        </>
    )
}
