import { useEffect, useState } from "react";
import Header from "./components/header";
import FileUploadPopup from "./components/file-uploader"
import ImageList from "./components/image-list";
import ImageViewer from "./components/image-viewer";
import RighSideBar from "./components/right-side-bar";
export function Home() {
    const [showUpload, setShowUpload] = useState(false);
    const [userFilesData, setUserFilesData] = useState([]);
    const [currentImage, setCurrentImage] = useState();

    useEffect(() => {
        reloadFiles();
    }, [])

    const reloadFiles = () => {
        getFiles().then(data => {
            setUserFilesData(data);
        }).catch(err => {
            console.log(err);
        });
    }

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

    const deleteImagesHandler = async () => {
        const deletedFiles = userFilesData.filter(file => file.status).map(file => String(file.id));
        await fetch('http://localhost:8000/files/multiple', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json',
            },
            method: 'DELETE',
            body: JSON.stringify(deletedFiles),
        });
        reloadFiles();
    }

    const clickNextHandler = (fileId) => {
        let index = userFilesData.findIndex((file) => file.id === fileId);
        if (index < userFilesData.length - 1) {
            console.log(index + 1);
            setCurrentImage(userFilesData[index + 1]);
        }
    }

    const clickBackHandler = (fileId) => {
        let index = userFilesData.findIndex((file) => file.id === fileId);
        if (index > 0) {
            console.log(index - 1);
            setCurrentImage(userFilesData[index - 1])
        }
    }

    const closeImageViewerHandler = () => {
        setCurrentImage(null);
    }

    const closeUploadHandler = () => {
        setShowUpload(false);
    }

    return (
        <>
            <Header clickDeleteHandler={deleteImagesHandler} clickUploadHandler={() => setShowUpload(true)} />
            {currentImage && <ImageViewer image={currentImage} clickNextHandler={clickNextHandler} clickBackHander={clickBackHandler} closeHandler={closeImageViewerHandler}/>}
            {showUpload && <FileUploadPopup closeHandler={closeUploadHandler}/>}
            <div className="h-20 w-1 "></div>
            <ImageList images={userFilesData} updateImages={setUserFilesData} setCurrentImage={setCurrentImage} />
        </>
    )
}
