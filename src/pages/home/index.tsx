import { createContext, useEffect, useState, Dispatch } from "react";
// import { useParams } from "react-router-dom";
import Header from "./components/header";
import FileList from "./components/file-list";
import LeftSideBar from "./components/left-side-bar";
import EditHeader from "./components/edit-header";

export interface Tag {
    label: string,
    id: number,
    count?: number
}

export interface UserFile {
    name: string,
    id: number,
    path: string,
    content_type: string,
    code: string,
    size: number,
    user_id: number,
    status: boolean,
    isCurrent?: boolean
    tags: Tag[],
}

interface UserFileContext {
    files: UserFile[],
    setFiles: Dispatch<React.SetStateAction<UserFile[]>>
}

export const AllFilesContext = createContext<UserFileContext>({files: [], setFiles: () => {}});

export function Home() {
    const [userFilesData, setUserFilesData] = useState<UserFile[]>([]);
    const [currentTag, setCurrentTag] = useState<number | null>(null);
    const [showLeftSideBar, setShowLeftSideBar] = useState(false);
    const [key, setKey] = useState(1);
    const [inSelectMode, setInSelectMode] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    // const { tagName } = useParams();

    useEffect(() => {
        setInSelectMode(userFilesData.some((file) => file.status === true) ? true : false);
        setKey(key + 1);
    }, [userFilesData])

    if (!localStorage.getItem('token')) {
        window.location.href = '/login';
    }

    const changeTagHandler = (tagId: number | null) => {
        setCurrentTag(tagId);
    }

    const toggleLeftSideBar = () => {
        setShowLeftSideBar(!showLeftSideBar);
    }


    return (
        <AllFilesContext.Provider 
            value={{
                files: userFilesData,
                setFiles: setUserFilesData
            }}
        >
            <div className="h-20 w-1 "></div>
            <div className="md:ml-[30vw]">
                <FileList 
                    tagId={currentTag}
                    selectAll={selectAll}
                    />
            </div>

            {
                showLeftSideBar &&
                <LeftSideBar key={key} changeTagHandler={changeTagHandler} currentTag={currentTag} />
            }

            <div className="invisible md:visible">
                <LeftSideBar key={key} changeTagHandler={changeTagHandler} currentTag={currentTag} />
            </div>
            <Header
                toggleRightSideBar={toggleLeftSideBar}
            />
            { inSelectMode && <EditHeader selectAll={selectAll} setSelectAll={setSelectAll}/> }
        </AllFilesContext.Provider>
    )
}

