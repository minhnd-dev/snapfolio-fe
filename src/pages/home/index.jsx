import { useEffect, useState } from "react";
import Header from "./components/header";
import FileUploadPopup from "./components/file-uploader"
import ImageList from "./components/image-list";
import ImageViewer from "./components/image-viewer";
import RightSideBar from "./components/right-side-bar";
import TagEditor from "./components/tag-editor";

export function Home() {
    const [showUpload, setShowUpload] = useState(false);
    const [userFilesData, setUserFilesData] = useState([]);
    const [currentImage, setCurrentImage] = useState();
    const [currentTag, setCurrentTag] = useState(null);
    const [showRighSideBar, setShowRightSideBar] = useState(false);
    const [showTagEditor, setShowTagEditor] = useState(false);

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
        const deletedFiles = userFilesData.filter(file => file.status).map(file => file.id);
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

    const updateFileTagHandler = (fileId, tags) => {
        setUserFilesData(
            userFilesData.map((file) => file.id === fileId ? { ...file, tags: tags } : file)
        );
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

    const changeTagHandler = (tagId) => {
        setCurrentTag(tagId);
        if (tagId === null) {
            reloadFiles();
        } else {
            fetch(`http://localhost:8000/files/by-tag/${tagId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then(response => response.json())
                .then(data => { setUserFilesData(data); console.log(data); })
                .catch(error => console.log(error));
        }
    }

    const toggleRightSideBar = () => {
        setShowRightSideBar(!showRighSideBar);
    }

    const closeTagEditorHandler = () => {
        setShowTagEditor(false);
    }

    return (
        <>
            {showTagEditor && <TagEditor closeHandler={closeTagEditorHandler} />}
            <Header
                clickDeleteHandler={deleteImagesHandler}
                clickUploadHandler={() => setShowUpload(true)}
                toggleRighSideBar={toggleRightSideBar}
            />
            {
                currentImage &&
                <ImageViewer
                    image={currentImage}
                    clickNextHandler={clickNextHandler}
                    clickBackHander={clickBackHandler}
                    closeHandler={closeImageViewerHandler}
                    updateTagHandler={updateFileTagHandler}
                />}
            {showUpload && <FileUploadPopup closeHandler={closeUploadHandler} />}
            <div className="h-20 w-1 "></div>
            <div className="md:ml-[30vw]">
                <ImageList images={userFilesData} updateImages={setUserFilesData} setCurrentImage={setCurrentImage} />
            </div>

            {
                showRighSideBar &&
                <RightSideBar changeTagHandler={changeTagHandler} currentTag={currentTag} setShowTagEditor={setShowTagEditor}/>
            }

            <div className="invisible md:visible">
                <RightSideBar changeTagHandler={changeTagHandler} currentTag={currentTag} setShowTagEditor={setShowTagEditor}/>
            </div>
        </>
    )
}
